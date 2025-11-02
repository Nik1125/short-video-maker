import { KokoroTTS, TextSplitterStream } from "kokoro-js";
import {
  VoiceEnum,
  type kokoroModelPrecision,
  type Voices,
  type VoiceMetadata,
} from "../../types/shorts";
import { KOKORO_MODEL, logger } from "../../config";

export class Kokoro {
  constructor(private tts: KokoroTTS) {}

  async generate(
    text: string,
    voice: Voices,
  ): Promise<{
    audio: ArrayBuffer;
    audioLength: number;
  }> {
    const splitter = new TextSplitterStream();
    const stream = this.tts.stream(splitter, {
      voice,
    });
    splitter.push(text);
    splitter.close();

    const output = [];
    for await (const audio of stream) {
      output.push(audio);
    }

    const audioBuffers: ArrayBuffer[] = [];
    let audioLength = 0;
    for (const audio of output) {
      audioBuffers.push(audio.audio.toWav());
      audioLength += audio.audio.audio.length / audio.audio.sampling_rate;
    }

    const mergedAudioBuffer = Kokoro.concatWavBuffers(audioBuffers);
    logger.debug({ text, voice, audioLength }, "Audio generated with Kokoro");

    return {
      audio: mergedAudioBuffer,
      audioLength: audioLength,
    };
  }

  static concatWavBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
    const header = Buffer.from(buffers[0].slice(0, 44));
    let totalDataLength = 0;

    const dataParts = buffers.map((buf) => {
      const b = Buffer.from(buf);
      const data = b.slice(44);
      totalDataLength += data.length;
      return data;
    });

    header.writeUInt32LE(36 + totalDataLength, 4);
    header.writeUInt32LE(totalDataLength, 40);

    return Buffer.concat([header, ...dataParts]);
  }

  static async init(dtype: kokoroModelPrecision): Promise<Kokoro> {
    const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL, {
      dtype,
      device: "cpu", // only "cpu" is supported in node
    });

    return new Kokoro(tts);
  }

  listAvailableVoices(): Voices[] {
    const voices = Object.values(VoiceEnum) as Voices[];
    return voices;
  }

  listVoicesWithMetadata(): VoiceMetadata[] {
    // Mapping of voice IDs to metadata based on naming conventions
    // Pattern: [age][gender]_[name]
    const metadata: Record<string, VoiceMetadata> = {
      // af_ = adult female
      [VoiceEnum.af_heart]: {
        id: VoiceEnum.af_heart,
        name: "Heart",
        gender: "female",
        age: "adult",
        style: "neutral",
        description: "Warm and friendly female voice",
      },
      [VoiceEnum.af_alloy]: {
        id: VoiceEnum.af_alloy,
        name: "Alloy",
        gender: "female",
        age: "adult",
        style: "professional",
        description: "Professional female voice",
      },
      [VoiceEnum.af_aoede]: {
        id: VoiceEnum.af_aoede,
        name: "Aoede",
        gender: "female",
        age: "adult",
        style: "casual",
        description: "Casual and approachable female voice",
      },
      [VoiceEnum.af_bella]: {
        id: VoiceEnum.af_bella,
        name: "Bella",
        gender: "female",
        age: "adult",
        style: "dramatic",
        description: "Expressive female voice",
      },
      [VoiceEnum.af_jessica]: {
        id: VoiceEnum.af_jessica,
        name: "Jessica",
        gender: "female",
        age: "adult",
        style: "neutral",
        description: "Clear and natural female voice",
      },
      [VoiceEnum.af_kore]: {
        id: VoiceEnum.af_kore,
        name: "Kore",
        gender: "female",
        age: "adult",
        style: "professional",
        description: "Professional business female voice",
      },
      [VoiceEnum.af_nicole]: {
        id: VoiceEnum.af_nicole,
        name: "Nicole",
        gender: "female",
        age: "adult",
        style: "casual",
        description: "Friendly and relaxed female voice",
      },
      [VoiceEnum.af_nova]: {
        id: VoiceEnum.af_nova,
        name: "Nova",
        gender: "female",
        age: "adult",
        style: "neutral",
        description: "Fresh and modern female voice",
      },
      [VoiceEnum.af_river]: {
        id: VoiceEnum.af_river,
        name: "River",
        gender: "female",
        age: "adult",
        style: "casual",
        description: "Calm and flowing female voice",
      },
      [VoiceEnum.af_sarah]: {
        id: VoiceEnum.af_sarah,
        name: "Sarah",
        gender: "female",
        age: "adult",
        style: "professional",
        description: "Confident professional female voice",
      },
      [VoiceEnum.af_sky]: {
        id: VoiceEnum.af_sky,
        name: "Sky",
        gender: "female",
        age: "adult",
        style: "neutral",
        description: "Light and airy female voice",
      },
      // am_ = adult male
      [VoiceEnum.am_adam]: {
        id: VoiceEnum.am_adam,
        name: "Adam",
        gender: "male",
        age: "adult",
        style: "professional",
        description: "Professional male voice",
      },
      [VoiceEnum.am_echo]: {
        id: VoiceEnum.am_echo,
        name: "Echo",
        gender: "male",
        age: "adult",
        style: "neutral",
        description: "Clear and resonant male voice",
      },
      [VoiceEnum.am_eric]: {
        id: VoiceEnum.am_eric,
        name: "Eric",
        gender: "male",
        age: "adult",
        style: "casual",
        description: "Friendly casual male voice",
      },
      [VoiceEnum.am_fenrir]: {
        id: VoiceEnum.am_fenrir,
        name: "Fenrir",
        gender: "male",
        age: "adult",
        style: "dramatic",
        description: "Powerful dramatic male voice",
      },
      [VoiceEnum.am_liam]: {
        id: VoiceEnum.am_liam,
        name: "Liam",
        gender: "male",
        age: "adult",
        style: "neutral",
        description: "Warm and natural male voice",
      },
      [VoiceEnum.am_michael]: {
        id: VoiceEnum.am_michael,
        name: "Michael",
        gender: "male",
        age: "adult",
        style: "professional",
        description: "Authoritative professional male voice",
      },
      [VoiceEnum.am_onyx]: {
        id: VoiceEnum.am_onyx,
        name: "Onyx",
        gender: "male",
        age: "adult",
        style: "dramatic",
        description: "Deep and dramatic male voice",
      },
      [VoiceEnum.am_puck]: {
        id: VoiceEnum.am_puck,
        name: "Puck",
        gender: "male",
        age: "adult",
        style: "casual",
        description: "Playful and energetic male voice",
      },
      [VoiceEnum.am_santa]: {
        id: VoiceEnum.am_santa,
        name: "Santa",
        gender: "male",
        age: "mature",
        style: "casual",
        description: "Jolly and cheerful male voice",
      },
      // bf_ = boy female (young female)
      [VoiceEnum.bf_emma]: {
        id: VoiceEnum.bf_emma,
        name: "Emma",
        gender: "female",
        age: "young",
        style: "casual",
        description: "Youthful cheerful female voice",
      },
      [VoiceEnum.bf_isabella]: {
        id: VoiceEnum.bf_isabella,
        name: "Isabella",
        gender: "female",
        age: "young",
        style: "neutral",
        description: "Young vibrant female voice",
      },
      [VoiceEnum.bf_alice]: {
        id: VoiceEnum.bf_alice,
        name: "Alice",
        gender: "female",
        age: "young",
        style: "casual",
        description: "Bright young female voice",
      },
      [VoiceEnum.bf_lily]: {
        id: VoiceEnum.bf_lily,
        name: "Lily",
        gender: "female",
        age: "young",
        style: "neutral",
        description: "Sweet young female voice",
      },
      // bm_ = boy male (young male)
      [VoiceEnum.bm_george]: {
        id: VoiceEnum.bm_george,
        name: "George",
        gender: "male",
        age: "young",
        style: "casual",
        description: "Energetic young male voice",
      },
      [VoiceEnum.bm_lewis]: {
        id: VoiceEnum.bm_lewis,
        name: "Lewis",
        gender: "male",
        age: "young",
        style: "neutral",
        description: "Youthful male voice",
      },
      [VoiceEnum.bm_daniel]: {
        id: VoiceEnum.bm_daniel,
        name: "Daniel",
        gender: "male",
        age: "young",
        style: "casual",
        description: "Friendly young male voice",
      },
      [VoiceEnum.bm_fable]: {
        id: VoiceEnum.bm_fable,
        name: "Fable",
        gender: "male",
        age: "young",
        style: "casual",
        description: "Storytelling young male voice",
      },
    };

    return this.listAvailableVoices().map(voice => metadata[voice] || {
      id: voice,
      name: voice.split('_')[1] || voice,
      gender: "neutral",
      age: "adult",
      style: "neutral",
      description: "Available voice",
    });
  }
}
