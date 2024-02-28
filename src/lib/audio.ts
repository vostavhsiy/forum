export class Player {
  audio: HTMLAudioElement;
  constructor() {
    this.audio = new Audio();
    this.audio.src = "/not.mp3";
    this.audio.loop = false;
  }

  async play() {
    await this.audio.play();
  }
}
