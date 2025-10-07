const convofilterBtns=document.querySelectorAll(".chat-conversations .conversation-header .convo-filter-container .convo-filter-btn");
const convoItems=document.querySelectorAll(".chat-conversations .convo-list .convo-item");

const inputField = document.querySelector('.message-composer input');
const voiceBtn = document.querySelector('.voice-btn');

convofilterBtns.forEach(convofilterBtn => {
  convofilterBtn.addEventListener('click', () => {
    if (convofilterBtn.classList.contains("all-btn")) {
      convoItems.forEach(convoItem => {
        convoItem.style.display = "block";
        
      });
    }
    else{
      convoItems.forEach(convoItem => {
        if(! convoItem.classList.contains("unread")){
          convoItem.style.display="none"
        }
      });
    }
  });
});


inputField.addEventListener('input', () => {
  if(inputField.value.trim()== ''){
    return;
  }
  else if (inputField.value.trim() !== '') {
    voiceBtn.src = './assets/images/send.png';
    voiceBtn.alt="send"
    voiceBtn.classList.add("send-btn")
    voiceBtn.classList.remove("voice-btn");
    const sendBtn=document.querySelector(".send-btn");
    sendBtn.addEventListener('click',sendMessage)
  } else {
    const sendBtn=document.querySelector(".send-btn");
    sendBtn.src = './assets/images/mic.png'; 
    sendBtn.alt="voice"
    sendBtn.classList.add("voice-btn");
    sendBtn.classList.remove("send-btn");
  }
});

const randomMessages = [
  "Sure, I'll get back to you.",
  "Yes, it's available.",
  "Sorry, it's already sold.",
  "Can you share more details?",
  "Thanks for reaching out!"
];
const messagesContainer=document.querySelector(".chat-active .chat-messages");
function sendMessage(){
  const date= new Date();
  let  hr= date.getHours();
  hr=hr % 12 || 12
  hr=paddZero(hr)
  let min=date.getMinutes();
  min=paddZero(min)
  const outGoing=inputField.value;
  let userMsgHtml=`<div class="message outgoing">
    <p class="message-text"> ${outGoing}</p>
    <div class="message-meta">
      <span class="message-time">${hr}:${min}</span>
      <img src="./assets/images/double-tick.svg" class="tick-icon" alt="read">
    </div>
  </div>`;
  messagesContainer.innerHTML+=userMsgHtml;
  const sellerMsg=randomMessages[Math.floor(Math.random()*randomMessages.length)]
  let sellerMsgHtml=`<div class="message incoming">
    <p class="message-text"> ${sellerMsg}</p>
    <div class="message-meta">
      <span class="message-time">${hr}:${min}</span>
    </div>
  </div>`;
  setTimeout(()=>{
    messagesContainer.innerHTML+=sellerMsgHtml;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },2000)
  
  inputField.value="";
}

inputField.addEventListener('keydown',(e)=>{
  if(e.key=="Enter"){
    if(e.target.value.trim() !==""){
      sendMessage()
    }
  }
})

function paddZero(num){
  return num >9?num:"0"+num
}


const chatCloseBtn=document.querySelector(".chat-close-btn-container .chat-close-btn");

chatCloseBtn.addEventListener('click',()=>{
  window.location.href="./product-detail.html"
})