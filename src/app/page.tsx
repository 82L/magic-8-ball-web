'use client'
import Image from "next/image";
import React, {useRef} from "react";
import { AudioRecorder } from 'react-audio-voice-recorder';
export default function Home() {
  const apiUrl = "http://localhost:7214/"
  const mediaRecorder = useRef(null);
  let audioBlobs: BlobPart[] = [];
  const wavBlob = useRef(new Blob())
  const stream = useRef(null);
  const constraints = { audio: true, video: false };
  const audioRef = useRef(null);
  enum AppState {
    WaitingToRecordAudio,
    RecordingAudio,
    SendingAudio,
    PlayingAudio,
  }
  const [recording, setRecording] = React.useState(AppState.WaitingToRecordAudio);

  const openAiText =  useRef("null")
  const [buttonImage, setButtonImage] = React.useState("/RecordButton.svg");
  const [buttonImageAlt, setButtonImageAlt] = React.useState("Icone d'enregistrement");
  const [buttonText, setButtonText] = React.useState("Poser une question à la balle 8 magique.");

  function handleClick(){
    switchAppState(recording);
    // switch(recording) {
    //   case AppState.WaitingToRecordAudio:
    //   
    //     break;
    //   case AppState.RecordingAudio:
    //     switchAppState(AppState.SendingAudio);
    //     break;
    //   case AppState.SendingAudio:
    //     switchAppState(AppState.PlayingAudio);
    //     break;
    //   case AppState.PlayingAudio:
    //     switchAppState(AppState.WaitingToRecordAudio);
    //     break;
    // }
  }


  async function debugCase() {
    var fileData = await fetch("/test.wav")

    getOpenAiResponse(await fileData.blob());

    // return new File("/test.wav")
  }

  function switchAppState(state : AppState) {
    switch(state){
      case AppState.WaitingToRecordAudio:
        // .then(
        //      () => {
        setRecording( AppState.RecordingAudio);
        setButtonData(AppState.RecordingAudio);


        // },
        // () =>{
        //   console.log("failure");
        // });
        startRecording()
        break;
      case AppState.RecordingAudio:
        stopRecording();
        // let blob = new Blob(audioBlobs , {type: "audio/webm"});
        debugCase()

        setRecording(AppState.SendingAudio);
        setButtonData(AppState.SendingAudio);

        break;
      case AppState.SendingAudio:
        console.log(openAiText.current);
        fetchAndPlayAudio(openAiText.current);
        setRecording(AppState.PlayingAudio);
        setButtonData(AppState.PlayingAudio);
        break;
      case AppState.PlayingAudio:
        setRecording(AppState.WaitingToRecordAudio);
        setButtonData(AppState.WaitingToRecordAudio);
        break;
    }

  }
  function getOpenAiResponse(audioBlob: Blob)  {
    // const formData = new FormData();
    // formData.append("audioFile", audioBlob);
    return fetch(apiUrl + "api/MagicBallAsk", {
      body: audioBlob,
      method: "POST",
    }).then(async (res) => {
      openAiText.current = await res.text();
      switchAppState(AppState.SendingAudio);
      // audioRef.current.play();
    });
  };

  async function fetchAndPlayAudio(text: string) {
    
    const response = await fetch(apiUrl +'api/MagicBallSpeech', {
      method: 'POST',
      // headers: { 'Content-Type': 'text/plain' },
      body: text,
    });

    if (!response.ok) {
      console.error('Failed to fetch audio:', response.statusText);
      return;
    }
    console.log("audio fetched");
    const audioContext = new (window.AudioContext)();
    const source = audioContext.createBufferSource();

    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = () =>{
      console.log("End Reader");
      audioContext.suspend();
      switchAppState(AppState.PlayingAudio);
    }
    source.start();

  }
  function setButtonData(appState: AppState) {
    switch(appState){
      case AppState.WaitingToRecordAudio:
        setButtonImage("/RecordButton.svg");
        setButtonImageAlt("Icone d'enregistrement");
        setButtonText("Poser une question à la balle 8 magique.");
        break;
      case AppState.RecordingAudio:
        setButtonImage("/StopRecordButton.svg");
        setButtonImageAlt("Icone d'arrêt d'enregistrement");
        setButtonText("Enregistrement de votre question, ré-appuyer pour l'envoyer.");
        break;
      case AppState.SendingAudio:
        setButtonImage("/spinner.svg");
        setButtonImageAlt("Icone de chargement");
        setButtonText("Votre question est en cours d'envoi.");
        break;
      case AppState.PlayingAudio:
        setButtonImage("/spinner.svg");
        setButtonImageAlt("Icone de chargement.");
        setButtonText("Voici votre réponse.");
        break;
    }
  }
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function startRecording() {



    // try {
    //   stream.current = await navigator.mediaDevices.getUserMedia(constraints);
    //
    //   mediaRecorder.current = new MediaRecorder(stream.current, {
    //     mimeType: "audio/webm",
    //   });
    //
    //   audioBlobs = [];
    //
    //   mediaRecorder.current.ondataavailable = e => e.data.size && audioBlobs.push(e.data);
    //  
    // } catch (err) {
    //   console.error(err);
    // }
    console.log("Starting recording");
    //   stream.current = await navigator.mediaDevices.getUserMedia({
    //     audio: true
    //   });
    //   audioBlobs = [];
    //   mediaRecorder.current = new MediaRecorder(stream.current,
    //       {
    //         mimeType: "audio/webm",
    //       });1
    //   mediaRecorder.current.ondataavailable = (event) => {
    //     /* add the data to the recordedDataArray */
    //     audioBlobs.push(event.data)
    //   }
    //   mediaRecorder.current.start();
  }

  async function stopRecording () {
    console.log("Stopping recording");

    // mediaRecorder.current.requestData();
    // mediaRecorder.current.stop();
    // stream.current.getAudioTracks().forEach(track => {
    //   track.stop();
    // })

    // wavBlob.current = await getWaveBlob(new Blob(audioBlobs),false);
    // console.log("download");
    // await downloadWav(wavBlob.current, false, "test.wav");
    // console.log("sending");
    // await getOpenAiResponse(wavBlob.current);
    // navigator.mediaDevices.getUserMedia({
    //   audio: false
    // });

  }

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <Image
              className="dark:invert"
              src="/8ball.svg"
              alt="Image de la balle 8 magique"
              width={180}
              height={180}
              priority
          />
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                rel="noopener noreferrer"
                onClick={handleClick}
                disabled={recording === AppState.SendingAudio || recording === AppState.PlayingAudio }
            >
              <Image
                  className=""
                  src={buttonImage}
                  alt={buttonImageAlt}
                  width={20}
                  height={20}
              />
              {buttonText}
            </button>
          </div>
          <p className="text-center">En posant une question, vous acceptez que l'enregistrement audio de votre voix soit traité par le service
            Azure de Microsoft.</p>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://bsky.app/profile/82l.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                className="dark:invert"
                aria-hidden
                src="/bluesky.svg"
                alt="Icone de BlueSky"
                width={16}
                height={16}
            />
            Mon Bluesky
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://82l.github.io/"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/globe.svg"
                alt="Icone de globe"
                width={16}
                height={16}
            />
            Visiter le portfolio de 82l →
          </a>
        </footer>
      </div>
  );
}
