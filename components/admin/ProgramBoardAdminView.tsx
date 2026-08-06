export default function ProgramBoardAdminView() {
  return (
    <div style={{ height: "calc(100vh - 64px)", minHeight: 680, overflow: "hidden", width: "100%" }}>
      <iframe
        src="/program-editor"
        style={{ border: 0, display: "block", height: "100%", width: "100%" }}
        title="NECYPAA Program Board"
      />
    </div>
  );
}
