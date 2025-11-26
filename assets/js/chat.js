const convofilterBtns=document.querySelectorAll(".chat-conversations .conversation-header .convo-filter-container .convo-filter-btn");
const convoItems=document.querySelectorAll(".chat-conversations .convo-list .convo-item");

const inputField = document.querySelector('.message-composer input');
const voiceBtn = document.querySelector('.voice-btn');

convofilterBtns.forEach(convofilterBtn => {
  convofilterBtn.addEventListener('click', () => {
    if (convofilterBtn.classList.contains("all-btn")) {
      convoItems.forEach(convoItem => {
        convoItem.classList.remove("not-active")
        
      });
    }
    else{
      convoItems.forEach(convoItem => {
        if(convoItem.classList.contains("active")){
          convoItem.classList.add("not-active")
        }
      });
    }
  });
});

const chatHeader=document.querySelector(".chat-inner-container .chat-active .chat-header")
const activeImg=chatHeader.querySelector(".contact-info .product-img")
const activeName=chatHeader.querySelector(".contact-info .contact-details .contact-user-info .contact-name")
const activeProductPreview=chatHeader.querySelector(".contact-info .contact-details .contact-user-info .active-product-preview")
const activePrice=chatHeader.querySelector(".contact-info .contact-details .contact-user-info .product-price")

const defaultMessages = [
  {
    chat: [
      { from: "in", text: "Is it available", time: "09.40" },
      { from: "out",  text: "Yes, it's available", time: "09.58" }
    ]
  },
  {
    chat: [
      { from: "in", text: "Is it available", time: "09.40" },
      { from: "out",  text: "Yes, it's available", time: "09.58" }
    ]
  },
  {
    chat: [
      { from: "in", text: "Is it available", time: "09.40" },
      { from: "out",  text: "Yes, it's available", time: "09.58" }
    ]
  }
];

let messages = JSON.parse(sessionStorage.getItem("storedMessages")) || [ ...defaultMessages];


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
function sendMessage(sellerMsg){
  const date= new Date();
  let  hr= date.getHours();
  hr=hr % 12 || 12
  hr=paddZero(hr)
  let min=date.getMinutes();
  min=paddZero(min)
  const outGoing=inputField.value;
  let clicked;
  convoItems.forEach((convoItem,index)=>{
    if(convoItem.classList.contains("active")){
      clicked=index;
    }
  })

  let userMsgHtml=`<div class="message outgoing">
    <p class="message-text"> ${outGoing}</p>
    <div class="message-meta">
      <span class="message-time">${hr}:${min}</span>
      <img src="./assets/images/double-tick.svg" class="tick-icon" alt="read">
    </div>
  </div>`;
  messagesContainer.innerHTML+=userMsgHtml;
  let sellerMsgHtml=`<div class="message incoming">
    <p class="message-text"> ${sellerMsg}</p>
    <div class="message-meta">
      <span class="message-time">${hr}:${min}</span>
    </div>
  </div>`;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  setTimeout(()=>{
    messagesContainer.innerHTML+=sellerMsgHtml;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  },2000)
  convoItems.forEach((convoItem,index)=>{
    if(convoItem.classList.contains("active")){
      console.log(convoItem)
      const messagePreview=convoItem.querySelector(".convo-info .convo-detail .convo-detail .convo-user-info .message-preview");
      console.log(messagePreview)
      messagePreview.innerHTML=` <img src="./assets/images/double-tick.svg" alt="tick" class="double-tick-icon">
          <span>${outGoing}</span>`;
      setTimeout(()=>{
        messagePreview.innerHTML=`
          <span>${sellerMsg}</span>`;
      },2000)
    }
  })
  inputField.value="";
}


function storeMessage(messageVal){
  const date= new Date();
  let  hr= date.getHours();
  hr=hr % 12 || 12
  hr=paddZero(hr)
  let min=date.getMinutes();
  min=paddZero(min)
  let clicked;
  convoItems.forEach((convoItem,index)=>{
    if(convoItem.classList.contains("active")){
      clicked=index;
    }
  })

  messages[clicked].chat.push({
  from: "out",
  text: messageVal,
  time: `${hr}.${min}`
});
  const sellerMsg=randomMessages[Math.floor(Math.random()*randomMessages.length)]

  sendMessage(sellerMsg)
  messages[clicked].chat.push({
  from: "in",
  text: sellerMsg,
  time: `${hr}.${min}`
});

  sessionStorage.setItem("storedMessages", JSON.stringify(messages));

}

inputField.addEventListener('keydown',(e)=>{
  if(e.key=="Enter"){
    if(e.target.value.trim() !==""){
      storeMessage(inputField.value)
      // sendMessage()

    }
  }
})

function paddZero(num){
  return num >9?num:"0"+num
}


convoItems.forEach((convoItem,index)=>{
  convoItem.addEventListener('click',()=>{
    const selectedProductImg=convoItem.querySelector(".convo-info .convo-detail .convo-product-picture");
    activeImg.src=selectedProductImg.src;
    activeImg.alt=selectedProductImg.alt;

    const contactName=convoItem.querySelector(".convo-info .convo-detail .convo-user-info .contact-name");
    activeName.textContent=contactName.textContent;
    
    const productPreview=convoItem.querySelector(".convo-info .convo-detail .convo-detail .convo-user-info .product-preview");
    activeProductPreview.textContent=productPreview.textContent

    activePrice.textContent=`$${Math.floor(Math.random()*90+999)-90}`;
    convoItems.forEach(convoItem=>{
      convoItem.classList.remove("active");
    })
    convoItem.classList.add("active");
    let clickedIndex;
    if(convoItem.classList.contains("active")){
      clickedIndex=index;
    }
    renderMessage(clickedIndex)
  })
})


function updateAllPreviews() {
  convoItems.forEach((item, index) => {
    const previewEl = item.querySelector(".message-preview");
    const chats = messages[index].chat;

    if (chats.length > 0) {
      const lastMsg = chats[chats.length - 1]; 
      previewEl.innerHTML = `
        ${lastMsg.from === "out" ? `<img src="./assets/images/double-tick.svg" class="double-tick-icon">` : ""}
        <span>${lastMsg.text}</span>
      `;
    }
  });
}


function renderMessage(clickedIndex) {
  const chat = messages[clickedIndex].chat;

  messagesContainer.innerHTML = "";

  chat.forEach(msg => {
    if (msg.from === "out") {
      messagesContainer.innerHTML += `
        <div class="message outgoing">
          <p class="message-text">${msg.text}</p>
          <div class="message-meta">
            <span class="message-time">${msg.time}</span>
            <img src="./assets/images/double-tick.svg" class="tick-icon">
          </div>
        </div>`;
    } else {
      messagesContainer.innerHTML += `
        <div class="message incoming">
          <p class="message-text">${msg.text}</p>
          <div class="message-meta">
            <span class="message-time">${msg.time}</span>
          </div>
        </div>`;
    }
  });
    updateAllPreviews();
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

renderMessage(0);
updateAllPreviews();

const chatCloseBtn=document.querySelector(".chat-close-btn-container .chat-close-btn");

chatCloseBtn.addEventListener('click',()=>{
  window.location.href="./product-detail.html"
})

const chatConversations=document.querySelector(".chat-inner-container .chat-conversations");

const chatActive=document.querySelector(".chat-inner-container .chat-active");

const chatActiveClose=chatHeader.querySelector(".chat-active-close-btn");

function setActiveChat(){
  if(window.innerWidth<=768){
 
    convoItems.forEach(convoItem=>{
      convoItem.addEventListener('click',()=>{
        chatConversations.classList.add("not-active");
        chatActive.classList.add("active")
      })
    })
    chatActiveClose.addEventListener("click",()=>{
      chatActive.classList.remove("active")
      chatConversations.classList.remove("not-active");
        
    })
  }

}
setActiveChat()
window.addEventListener('resize', setActiveChat)

const chatSearch=chatConversations.querySelector(".conversation-header .chat-search-wrapper input");

const contactNames=chatConversations.querySelectorAll(".convo-item .convo-detail .contact-name")
let contactNameArr=[];
contactNames.forEach(contactName=>{
  contactNameArr.push(contactName.textContent)
})

chatSearch.addEventListener("input",(e)=>{
  const searchVal = e.target.value.toLowerCase().trim();
  if(! searchVal){
    convoItems.forEach(convoItem => {
      convoItem.classList.remove("not-active")
    })
    const notFound= document.querySelector(".convo-list .not-found");
    notFound.classList.remove("active");
    return;
  }
  let results = contactNameArr.filter(name =>
    name.toLowerCase().includes(searchVal)
  );
 renderContacts(results);
 
})

function renderContacts(contactList){
  const notFound= document.querySelector(".convo-list .not-found");
  let lowerList = contactList.map(item => item.toLowerCase());
  if(lowerList.length >0) {
    notFound.classList.remove("active");
    convoItems.forEach(convoItem => {
      const name = convoItem.querySelector(".contact-name").textContent.trim().toLowerCase();
        console.log(name)
      let isMatch = lowerList.some(item => name.includes(item));
        console.log(isMatch)
      if (isMatch) {
        convoItem.classList.remove("not-active");
      } else {
          convoItem.classList.add("not-active");
      }

    });
  }
  else{
    convoItems.forEach(convoItem=>{
      convoItem.classList.add("not-active");
    })
    
    notFound.classList.add("active");
  }
}