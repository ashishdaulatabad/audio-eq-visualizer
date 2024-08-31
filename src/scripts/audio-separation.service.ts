import { GlobalAudioService } from "../service/global.service"

export async function createAudioSeparationConfiguration(
    audioFile: File,
    audioService: GlobalAudioService
) {
    const fileReaderPromise = async () => {
        return new Promise<ArrayBuffer>((resolve) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioFile);

            fileReader.onloadend = (event: ProgressEvent<FileReader>) => {
                const target = event.target as FileReader;
                resolve(target.result as ArrayBuffer);
            }
        })
    }
    const buffer = await fileReaderPromise();
    const audioBuffer: AudioBuffer = await audioService.useAudioContext().decodeAudioData(buffer);

    return audioBuffer;
}
