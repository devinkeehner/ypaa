import { useEffect, useEffectEvent } from "react";

type ToolInput = Record<string, unknown>;
type ToolHandler = (input: ToolInput) => unknown;
type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input?: ToolInput) => unknown;
};
type WebMCPDocument = Document & {
  modelContext?: {
    registerTool: (tool: WebMCPTool, options: { signal: AbortSignal }) => Promise<void>;
  };
};

export function useProgramBoardWebMCP({
  ready, canManage, dates, times, list, stageMove, stageResize,
}: {
  ready: boolean;
  canManage: boolean;
  dates: readonly string[];
  times: readonly string[];
  list: ToolHandler;
  stageMove: ToolHandler;
  stageResize: ToolHandler;
}) {
  const listSchedule = useEffectEvent(list);
  const moveSession = useEffectEvent(stageMove);
  const resizeSession = useEffectEvent(stageResize);

  useEffect(() => {
    const context = (document as WebMCPDocument).modelContext;
    if (!ready || typeof context?.registerTool !== "function") return;

    const controller = new AbortController();
    const date = { type: "string", enum: dates, description: "Convention date in Eastern time (YYYY-MM-DD)." };
    const sessionId = { type: "string", description: "Session ID returned by program_board_list." };
    const roomId = { type: "string", description: "Room ID returned by program_board_list." };
    const schema = (properties: Record<string, unknown>, required: string[] = []) => ({
      type: "object", properties, required, additionalProperties: false,
    });
    const tools: WebMCPTool[] = [{
      name: "program_board_list",
      description: "Read the Payload Program Board's rooms and sessions for one convention date. Defaults to the selected date.",
      inputSchema: schema({ date, roomId }),
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: (input) => listSchedule(input ?? {}),
    }];

    if (canManage) tools.push({
      name: "program_board_stage_move",
      description: "Stage a session move to a date, room, and start time while keeping its duration. Review and apply it on the board to save.",
      inputSchema: schema({
        sessionId, roomId, date,
        startTime: { type: "string", enum: times, description: "Start time in Eastern time (24-hour HH:mm)." },
      }, ["sessionId", "roomId", "date", "startTime"]),
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute: (input) => moveSession(input ?? {}),
    }, {
      name: "program_board_stage_resize",
      description: "Stage a change to the start or end of a session, including any affected neighbors in the same room. Review and apply it on the board to save.",
      inputSchema: schema({
        sessionId,
        edge: { type: "string", enum: ["start", "end"] },
        deltaSlots: { type: "integer", minimum: -32, maximum: 32, description: "Number of half-hour steps. Negative moves the edge earlier; positive moves it later." },
      }, ["sessionId", "edge", "deltaSlots"]),
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute: (input) => resizeSession(input ?? {}),
    });

    void Promise.all(tools.map(async (tool) => {
      await context.registerTool(tool, { signal: controller.signal });
    })).catch((error: unknown) => {
      if (!controller.signal.aborted) {
        controller.abort();
        console.warn("Could not register Program Board WebMCP tools.", error);
      }
    });

    return () => controller.abort();
  }, [ready, canManage, dates, times]);
}
