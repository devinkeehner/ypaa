export class ImageResponse extends Response {
  constructor() {
    super("Open Graph image generation is disabled", { status: 404 });
  }
}
