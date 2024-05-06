<h2> <b> NURO: A wearable assistant for dementia patients with reminders, location tracking and adaptive learning. Empowering independence, easing caregiver worries.</b> </h2>
<h2> UOttowa Hacks Winning project </h2>

The full demo for Nuro is available here: https://www.youtube.com/watch?v=Xg-xnQyxqBo

<h2> Inspiration </h2>
"Every day in Canada, more than 350 people develop dementia"

Alzheimer Society of Canada Dementia and memory loss is a worldwide problem and we witnessed the challenges faced by dementia patients and their caregivers on a daily basis. This drove us to create a solution that could enhance the quality of life for dementia patients while providing much-needed support to their caregivers.

<h2> What it does </h2>
NURO is a comprehensive wearable assistant designed specifically for individuals living with dementia. It serves multiple functions to address various aspects of their daily life challenges. Firstly, NURO provides personalized reminders for medications, appointments, and daily routines, helping to mitigate memory lapses and maintain a sense of normalcy. Secondly, it offers real-time location tracking with geo-fencing capabilities to prevent dangerous wandering behaviors, ensuring the safety of the wearer. Additionally, NURO incorporates adaptive learning technology, which analyzes the wearer's behaviors, routines, and preferences to tailor its reminders and interactions over time, making it more effective and personalized. Last but definitely not the least, if the user forgets something, the AI voice will answer and tell the user the answer.

<h2> How we built it </h2>
NURO was built using a combination of hardware and software components. For the hardware, we utilized a Raspberry Pi as the central processing unit, which was made wearable through a clip-on design. Additionally, we integrated a microphone for voice input and wireless speakers for audible reminders and communication. On the software side, we developed a frontend interface that allows users to manage reminders, appointments, and other settings. We also implemented algorithms for real-time location tracking, adaptive learning, and data analysis.

<h2> Challenges we ran into </h2>
We ran into a few challenges during the development of this project. The first one being live speech diarization. Current online integrations do not support live speaker diarization, so we had to implement a pipeline with the help of FFMPEG.

<h2> Accomplishments that we're proud of </h2>
We're very proud of our accomplishments such as integrating the Solace Event Broker into our application. Furthermore, we're proud of integrating hardware components within our application such as the Raspberry Pi and a microphone. We're very proud of speech-to-text conversion which was able to recognize different voices ( speech diarisation).

<h2> What we learned </h2>
We learned about the process of multithreading in a Python script. In terms of hardware, we learned how to configure a Raspberry Pi and integrate this computer with other components. Additionally, we became proficient in using LLM models to manipulate our data and learned about the usage of a VectorDB database. Our team also learned about the best practices to integrate the Solace Event Broker into our application.

<h2> What's next for Nuro </h2>
In the future, we could try to implement visual feed along with the auditory feed. This visual feed can be very useful when it comes to remembering where you put things. A lot of dementia patients forget where they last placed their object such as their keys. This visual feed can capture where the items were last placed and remind the patient where their item is. This visual feed can just be a camera in the patient's glasses.
