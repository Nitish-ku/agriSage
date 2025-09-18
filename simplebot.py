# pip install gradio google-generativeai gTTS SpeechRecognition pydub langdetect

import os, tempfile
import gradio as gr
import google.generativeai as genai
from gtts import gTTS
import speech_recognition as sr
from pydub import AudioSegment
from langdetect import detect
import dotenv

# 🔑 Load API key
dotenv.load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")
chat_session = model.start_chat(history=[])

# --- Detect language safely ---
def detect_lang(text):
    try:
        return detect(text)
    except:
        return "en"

# --- Voice to Text (STT) ---
def voice_to_text(audio_file):
    if audio_file is None:
        return ""
    
    # Convert to wav if not already
    if not audio_file.endswith(".wav"):
        audio = AudioSegment.from_file(audio_file)
        wav_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        audio.export(wav_file.name, format="wav")
        audio_file = wav_file.name
    
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        audio = recognizer.record(source)

    # Let Google STT auto-detect language → we’ll detect text after
    try:
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "(could not understand audio)"
    except sr.RequestError:
        return "(speech recognition error)"

# --- Chatbot (LLM) ---
def chatbot(message, history):
    user_lang = detect_lang(message)

    # Prompt Gemini to reply in same language
    if user_lang != "en":
        prompt = f"User asked in {user_lang}. Please answer in {user_lang}.\n\n{message}"
    else:
        prompt = message

    response = chat_session.send_message(prompt)
    reply = response.candidates[0].content.parts[0].text
    return reply

# --- Text to Speech (TTS) ---
def speak_text(text):
    if not text.strip():
        return None
    
    lang = detect_lang(text)

    # Map for gTTS
    lang_map = {
        "zh-cn": "zh", "zh-tw": "zh",
        "pt-br": "pt",
        "en-us": "en", "en-gb": "en",
        "ml": "ml"
    }
    lang = lang_map.get(lang, lang)

    try:
        tts = gTTS(text=text, lang=lang)
    except:
        tts = gTTS(text=text, lang="en")  # fallback
    
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(tmp_file.name)
    return tmp_file.name

# --- UI ---
with gr.Blocks(theme=gr.themes.Soft(primary_hue="cyan", secondary_hue="pink")) as demo:
    gr.Markdown("## 🌍 Gemini 1.5 Flash Chatbot\nTalk, listen & chat in multiple languages 🔊")

    chatbot_ui = gr.Chatbot(type="messages", label="💬 Chat")
    msg = gr.Textbox(placeholder="Type your message here...")
    send_btn = gr.Button("Send")

    with gr.Row():
        mic = gr.Audio(sources=["microphone"], type="filepath", label="🎤 Speak")
        audio_out = gr.Audio(label="AI Voice", type="filepath", interactive=False)

    # --- Send typed message ---
    def send_message(user_message, history):
        reply = chatbot(user_message, history)
        history.append({"role": "user", "content": user_message})
        history.append({"role": "assistant", "content": reply})
        return history, ""

    send_btn.click(send_message, [msg, chatbot_ui], [chatbot_ui, msg])
    msg.submit(send_message, [msg, chatbot_ui], [chatbot_ui, msg])

    # --- Voice input (STT) ---
    mic.stop_recording(fn=voice_to_text, inputs=mic, outputs=msg)

    # --- Speak last AI reply ---
    def speak_last(history):
        if not history or history[-1]["role"] != "assistant":
            return None
        return speak_text(history[-1]["content"])

    gr.Button("🔊 Speak Last Reply").click(speak_last, inputs=chatbot_ui, outputs=audio_out)

demo.launch(server_name="0.0.0.0", server_port=7860)
