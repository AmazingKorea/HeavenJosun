const inputBar = document.querySelector("#comment-input"); 
const rootDiv = document.querySelector("#comments"); 
const btn = document.querySelector("#submit"); 
const mainCommentCount = document.querySelector('#count'); //맨위 댓글 숫자 세는거. 

//글로벌로 값 저장
let idOrVoteCountList=[];

//작성한 시각 표시
function generateTime(){ 
  const date = new Date(); 
  const year = date.getFullYear(); 
  const month = date.getMonth(); 
  const wDate = date.getDate(); 
  const hour = date.getHours(); 
  const min = date.getMinutes(); 
  const sec = date.getSeconds(); 

  const time = year+'-'+month+'-'+wDate+' '+hour+':'+min+':'+sec; 
  return time; 
} 
//유저이름 발생기 
//유저이름은 8글자로 제한. 
function generateUserName(){ 
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'; 
  var makeUsername = ''; 
  for(let i=0; i<4;i++){ 
    let index = Math.floor(Math.random(10) * alphabet.length); 
    makeUsername += alphabet[index]; 
  } 
  for(let j=0;j<4;j++){ 
    makeUsername += "*"; 
  } 
  return makeUsername; 
} 

function numberCount(event){ 
  console.log(event.target.parentNode.id); 
  for(let i=0; i<idOrVoteCountList.length; i++){ 
    if(event.target.className === "voteUp"){ 
      

      if(idOrVoteCountList[i]["commentId"].toString() === event.target.parentNode.id){ 
        idOrVoteCountList[i]["voteUpCount"]++; 
        event.target.innerHTML = "👍"+idOrVoteCountList[i]["voteUpCount"]; 
      } 
    }else if(event.target.className === "voteDown"){ 
      if(idOrVoteCountList[i]["commentId"].toString() === event.target.parentNode.id){ 
        idOrVoteCountList[i]["voteDownCount"]++; 
        event.target.innerHTML = "👎"+idOrVoteCountList[i]["voteDownCount"]; 
      } 
    } 
  } 
}

//기존에 남아있던 id초기화 및 새로추가된부분만 코멘트값 이어서 들어옴.
function initIdCount(){ 
  for(let i=0; i<idOrVoteCountList.length; i++){ 
    if(idOrVoteCountList[i]["commentId"] - i > 1){ 
      idOrVoteCountList[i]["commentId"] = idOrVoteCountList[i]["commentId"] - (idOrVoteCountList.length-(i+1)); 
    } 
  } 
}

function deleteComments(event){ 
  const btn = event.target; 
  const list = btn.parentNode.parentNode;//commentList 
  for(let i=0; i<idOrVoteCountList.length; i++){ 
    if(idOrVoteCountList[i]["commentId"].toString() === btn.parentNode.id){ 
      idOrVoteCountList.splice(btn.parentNode.id-1,1); 
    } 
  }
  //전체지우기
  rootDiv.removeChild(list); 
  
  //메인댓글 카운트 줄이기.
  if(mainCommentCount.innerHTML <='0'){ 
    mainCommentCount.innerHTML = 0; 
  }else{ mainCommentCount.innerHTML--; 
       } 
}

//댓글보여주기 
function showComment(comment){ 
  const userName = document.createElement('div'); 
  const inputValue = document.createElement('span'); 
  const showTime = document.createElement('div'); 
  const voteDiv = document.createElement('div'); 
  const countSpan = document.createElement('span') 
  const voteUp = document.createElement('button'); 
  const voteDown = document.createElement('button'); 
  const commentList = document.createElement('div');
  const spacer = document.createElement('div');

  const newId = idOrVoteCountList.length+1;

  spacer.className = "spacer";
  
  //삭제버튼 만들기 
  const delBtn = document.createElement('button'); 
  delBtn.className ="deleteComment"; 
  delBtn.innerHTML="delete"; 
  commentList.className = "eachComment"; 
  userName.className="name";
  userName.id = newId; 
  inputValue.className="inputValue"; 
  showTime.className="time"; 
  voteDiv.className="voteDiv";
  voteDiv.id = newId;
  //유저네임가져오기 
  userName.innerHTML = generateUserName(); 
  userName.appendChild(spacer); 
  userName.appendChild(delBtn); 
  //입력값 넘기기 
  inputValue.innerText = comment; 
  //시간표시
  showTime.innerHTML = generateTime(); 
  countSpan.innerHTML=0; 
  //투표창 만들기, css먼저 입혀야함. 
  voteUp.className ="voteUp"; 
  voteDown.className ="voteDown"; 
  voteUp.innerHTML = "👍"+0; 
  voteDown.innerHTML = "👎"+0;
  voteDiv.appendChild(voteUp); 
  voteDiv.appendChild(voteDown); 
  
  //댓글뿌려주기 
  commentList.appendChild(userName); 
  commentList.appendChild(inputValue); 
  commentList.appendChild(showTime); 
  commentList.appendChild(voteDiv); 
  rootDiv.prepend(commentList); 

  let IdAccordingToVoteCount ={ 
    "commentId" : newId, 
    "voteUpCount" : 0, 
    "voteDownCount" : 0 
  } 
  
  idOrVoteCountList.push(IdAccordingToVoteCount); 
  console.log(idOrVoteCountList); 
  
  
  initIdCount();

  
  voteUp.addEventListener("click",numberCount); 
  voteDown.addEventListener("click",numberCount); 
  delBtn.addEventListener("click",deleteComments);

} 

//버튼만들기+입력값 전달 
function pressBtn(){ 
  const currentVal = inputBar.value; 
  if(!currentVal.length){ 
    alert("댓글을 입력해주세요!!"); 
  }else{ showComment(currentVal); 
        mainCommentCount.innerHTML++; 
        inputBar.value =''; 
       } 
} 

btn.onclick = pressBtn;