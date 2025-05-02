class Piper {
  constructor(model, config) {
    this.model = model;
    this.config = config;
    this.ort = null;
    this.session = null;
  }

  async init() {
    if (!this.ort) {
      this.ort = await import('onnxruntime-web');
    }
    if (!this.session) {
      this.session = await this.ort.InferenceSession.create(this.model);
    }
  }

  async synthesize(text) {
    await this.init();

    // Preprocess text
    const phonemes = this.textToPhonemes(text);
    const phonemeIds = this.phonemesToIds(phonemes);

    // Prepare input tensor
    const inputTensor = new this.ort.Tensor('int64', new BigInt64Array(phonemeIds), [1, phonemeIds.length]);

    // Run inference
    const outputs = await this.session.run({ input: inputTensor });
    const audioData = outputs.output.data;

    // Convert to audio buffer
    const audioBuffer = new Float32Array(audioData);
    
    // Create WAV file
    const wavBuffer = this.createWavFile(audioBuffer);
    return wavBuffer;
  }

  textToPhonemes(text) {
    // Simple phoneme conversion (this should be replaced with a proper phonemizer)
    return text.split('').map(char => char.toLowerCase());
  }

  phonemesToIds(phonemes) {
    // Convert phonemes to IDs using the config
    return phonemes.map(phoneme => {
      const id = this.config.phoneme_to_id[phoneme];
      return id !== undefined ? id : 0;
    });
  }

  createWavFile(audioData) {
    const numChannels = 1;
    const sampleRate = 22050;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioData.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // Write WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write audio data
    const offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset + i * bytesPerSample, value, true);
    }

    return buffer;
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

window.Piper = Piper; 