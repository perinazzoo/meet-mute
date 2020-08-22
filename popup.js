let mute = document.querySelector("#mute");
let volumeInput = document.querySelector("#volume");
let percentage = document.querySelector("#percentage");
let volume;

const code = `(function getUrls(){
  const audioList = [];

  document.querySelectorAll('audio').forEach((el) => audioList.push(el.volume));
  const href = window.location.href;
  return { audioList, href };
})()`;

window.onload = function () {
  checkIfHasVolume();
}

volumeInput.onchange = (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: `document.querySelectorAll("audio").forEach((aud) => aud.volume = ${e.target.value})` });
  });

  checkIfHasVolume();
}

mute.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: `document.querySelectorAll("audio").forEach((aud) => aud.volume = ${volume ? 0 : 1})` });
  });

  checkIfHasVolume();
}

function changeColor() {
  if (volume) {
    mute.style.backgroundColor = "#DF2935";
    return;
  }
  mute.style.backgroundColor = "#26C485";
}

function callBackAudioList(result) {
  const { audioList } = result[0];

  const anyVolumeOn = audioList.some((aud) => aud > 0);

  volume = anyVolumeOn;

  mute.innerHTML = volume ? 'Mute' : 'Unmute';

  const volumePercentage = audioList[0]

  changeColor();
  changeVolumePercentage(volumePercentage);
}

function checkIfHasVolume() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code },
      callBackAudioList
    )
  });
}

function changeVolumePercentage(value) {
  const number = String(value).replace('0.', '');
  volumeInput.value = value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: "console.log('test')" },
    )
  });
  if (value < 1) {
    const finalNumber = `${number}${number.length < 2 ? number === '0' ? '' : '0' : ''}%`;
    percentage.innerHTML = finalNumber.startsWith('0') && finalNumber !== '0%' ? finalNumber.replace('0', '') : finalNumber;
    return;
  }

  percentage.innerHTML = `${number}00%`;
}
