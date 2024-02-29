export class Player {
  audio: HTMLAudioElement | null;
  constructor() {
    this.audio = typeof Audio !== "undefined" ? new Audio("/not.mp3") : null;
    if (this.audio) {
      this.audio.src = "/not.mp3";
      this.audio.loop = false;
    }
  }

  async play() {
    await this.audio?.play();
  }
}
