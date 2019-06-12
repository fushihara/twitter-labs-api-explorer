const localStorageKeyPrefix = "2opj4bz5-";
const saveInputElementIds = ["api-consumer-key", "api-consumer-secret", "api-access-key", "api-access-secret", "tweets-ids", "tweets-format", "tweets-expansions", "users-ids", "users-usernames", "users-format"];

document.querySelector("#tweets-submit").addEventListener("click", () => { fireTweetApi(); });
document.querySelector("#users-submit").addEventListener("click", () => { fireUserApi(); });
document.querySelector("#copy-result").addEventListener("click", () => { copyResult(); });
loadInputValue();
function copyResult(){
  navigator.clipboard.writeText( document.querySelector("#result-body").innerText );
}
function fireTweetApi() {
  const ids = document.querySelector("#tweets-ids").value;
  const format = document.querySelector("#tweets-format").value;
  const expansions = document.querySelector("#tweets-expansions").value;
  const request_data = {
    url: "https://api.twitter.com/labs/1/tweets?" + [
      `ids=${encodeURIComponent(ids)}`,
      `format=${format}`,
      `expansions=${encodeURIComponent(expansions)}`
    ].join("&"),
    method: 'GET',
    //data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
  }
  requestGet(request_data.url);
}
function fireUserApi() {
  const ids = document.querySelector("#users-ids").value;
  const usernames = document.querySelector("#users-usernames").value;
  const format = document.querySelector("#users-format").value;
  const request_data = {
    url: "https://api.twitter.com/labs/1/users?" + [
      ids ? `ids=${encodeURIComponent(ids)}` : `usernames=${encodeURIComponent(usernames)}`,
      `format=${format}`
    ].join("&"),
    method: 'GET',
    //data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
  }
  requestGet(request_data.url);
}
function requestGet(url) {
  const consumerKey = {
    key: document.querySelector("#api-consumer-key").value,
    secret: document.querySelector("#api-consumer-secret").value
  };
  const accessToken = {
    key: document.querySelector("#api-access-key").value,
    secret: document.querySelector("#api-access-secret").value
  };
  const oauth = OAuth({
    consumer: consumerKey,
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64)
    },
  });
  const request_data = {
    url,
    method: "GET"
  };
  const requestHeader = oauth.toHeader(oauth.authorize(request_data, accessToken));
  fetch(url, {
    method: "GET",
    headers: requestHeader,
  }).then(response => response.json().then(json => {
    document.querySelector("#result-body").innerText = JSON.stringify(json, null, "  ");
    saveInputValue();
  }));
}
function saveInputValue() {
  for (let id of saveInputElementIds) {
    const val = (document.querySelector(`#${id}`) || {}).value || "";
    localStorage.setItem(`${localStorageKeyPrefix}${id}`, val);
  }
}
function loadInputValue() {
  for (let id of saveInputElementIds) {
    const val = localStorage.getItem(`${localStorageKeyPrefix}${id}`) || "";
    if (val !== "") {
      (document.querySelector(`#${id}`) || {}).value = val;
    }
  }
}