import React from "react";
import "./global.scss";

type SendType = any;

export default function App() {
  function strLength(str: string) {
    if (str.length > 22) {
      return str.slice(0, 22) + "...";
    }
    return str;
  }

  const [img, setImg] = React.useState(false);

  const [send, setSend] = React.useState<SendType>([]);
  const input = React.useRef<any>(false);
  const [reload, setRelooad] = React.useState(false);

  const messageFunc = (e: any) => {
    e.preventDefault();

    setSend([
      ...send,
      {
        requist: false,
        value: e.target[0].value,
        id: Math.round(Math.random() * 1000),
      },
    ]);

    input.current.value = "";

    setRelooad(!reload);
  };

  React.useEffect(() => {
    if (send.length) {
      const API_URL = "https://api.openai.com/v1/chat/completions";
      const API_KEY = "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";
      const messages2 = [
        {
          role: "user",
          content:
            send.length > 1
              ? send[send.length - 2].value + " " + send[send.length - 1].value
              : send[send.length - 1].value,
        },
      ];
      if (img) {
        fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            prompt: send[send.length - 1].value,
            n: 4,
            size: "512x512",
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setSend(
              send.map((el: any, i: number) => {
                if (i === send.length - 1) {
                  el.imgs = data.data;
                }
                return el;
              })
            );
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages2,
            temperature: 0.7,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data?.error) {
              setSend(
                send.map((el: any, i: number) => {
                  if (i === send.length - 1) {
                    el.requist = {
                      choices: [
                        {
                          mesage: data.error.message,
                        },
                      ],
                    };
                  }
                  return el;
                })
              );
            } else {
              setSend(
                send.map((el: any, i: number) => {
                  if (i === send.length - 1) {
                    el.requist = data;
                  }
                  return el;
                })
              );
            }
          })
          .catch((error) => {
            setSend(
              send.map((el: any, i: number) => {
                if (i === send.length - 1) {
                  el.requist = {
                    choices: [
                      {
                        mesage: error,
                      },
                    ],
                  };
                }
                return el;
              })
            );
          });
      }
    }
  }, [reload]);

  function extractMultipleCodeFromStr(str: string) {
    const regex = /```([\s\S]*?)```/g;
    const codeBlocks = str.match(regex);

    const codes = codeBlocks?.map((block) => {
      return block.replace(/```/g, "").trim();
    });

    let codes2 = codes?.map((el) => {
      let str = "";
      let str2 = "";
      for (let i = 0; i < el.length; i++) {
        if (el[i] == " ") {
          for (let f = i + 1; f < el.length; f++) {
            str2 += el[f];
          }
          return {
            language: str,
            code: str2,
          };
        }
        str += el[i];
      }
    });

    let newStr = str + "";

    if (codes2?.length) {
      newStr.replace(
        `\`\`\`${codes2[0]?.language} ${codes2[0]?.code}\`\`\``,
        "${code[0]}"
      );

      if (codes2?.length > 1) {
        newStr.replace(
          `\`\`\`${codes2[1]?.language} ${codes2[2]?.code}\`\`\``,
          "${code[1]}"
        );
      }

      if (codes2?.length > 2) {
        newStr.replace(
          `\`\`\`${codes2[2]?.language} ${codes2[2]?.code}\`\`\``,
          "${code[2]}"
        );
      }
    }

    return { codes2, newStr };
  }

  const [textCopied, setTextCopied] = React.useState(false);
  let salom = "salom";
  function handleButtonClick() {
    navigator.clipboard.writeText(salom);
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000); // 2 seconds
  }

  const inputValue = (str: string) => {
    input.current.value = str;
  };

  return (
    <div className="main">
      <div className="main__left">
        <button className="main__left-btn">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>
        <div className="main__left-chats">
          <button className="main__left-chat-checked">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            What's your name ?
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Nex-js what install ?
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            New React-js project ?
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Html,JavaScript codes ?
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {strLength(
              "Programming is like art, you create something out of nothing."
            )}
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {strLength(
              "The key to good programming is not just writing code, but writing code that others can understand"
            )}
          </button>{" "}
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {strLength("A program is never finished until the last user dies")}
          </button>
        </div>

        <footer className="footer">
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Clear conversations
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Upgrade to Plus
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Dark mode
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Updates & FAQ
          </button>
          <button className="main__left-chat">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log out
          </button>
        </footer>
      </div>
      <div className="main__right">
        {send.length > 0 ? (
          <div className="main__right-chat">
            {" "}
            {send.length > 0
              ? send?.map((el: any) => (
                  <div className="main__message" key={el.id}>
                    <div className="main__message-user" id={el.id}>
                      <img
                        src="https://chat.openai.com/_next/image?url=https%3A%2F%2Fs.gravatar.com%2Favatar%2Fae869a5725b39a09f6669a6a1d311bef%3Fs%3D480%26r%3Dpg%26d%3Dhttps%253A%252F%252Fcdn.auth0.com%252Favatars%252Fol.png&w=32&q=75"
                        alt="avatar"
                      />{" "}
                      <p>{el.value}</p>
                    </div>

                    <span className="main__message-chegara"></span>

                    <div className="main__message-chat-box">
                      <div className="main__message-chat">
                        <div>
                          <svg
                            width="41"
                            height="41"
                            viewBox="0 0 41 41"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            strokeWidth="1.5"
                            className="h-6 w-6"
                          >
                            <path
                              d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>

                        {el.requist ? (
                          <p>
                            {el?.requist?.choices[0]?.message?.content}

                            <div className="message__codes">
                              <div>
                                <p>javascript</p>
                                <button
                                  onClick={handleButtonClick}
                                  type="button"
                                >
                                  {textCopied ? (
                                    <>
                                      {" "}
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <svg
                                        stroke="currentColor"
                                        fill="none"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect
                                          x="8"
                                          y="2"
                                          width="8"
                                          height="4"
                                          rx="1"
                                          ry="1"
                                        ></rect>
                                      </svg>
                                      Copy code
                                    </>
                                  )}
                                </button>
                              </div>
                              <div></div>
                            </div>
                          </p>
                        ) : (
                          <>
                            {el?.imgs ? (
                              <div className="imgs-box">
                                {" "}
                                <img src={el?.imgs[0]?.url} alt="imgs" />
                                <img src={el?.imgs[1]?.url} alt="imgs" />
                                <img src={el?.imgs[2]?.url} alt="imgs" />
                                <img src={el?.imgs[3]?.url} alt="imgs" />
                              </div>
                            ) : (
                              "..."
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        ) : (
          <>
            {" "}
            <h1 className="main__title">ChatGpt</h1>
            <div className="main__examples-box">
              <div className="main__example">
                <div className="main__example-title-box">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  <h2>Examples</h2>
                </div>
                <div className="main__examples-btn-box">
                  <button
                    onClick={() =>
                      inputValue("Explain quantum computing in simple terms")
                    }
                    className="main__examples-btn"
                  >
                    "Explain quantum computing in simple terms" →
                  </button>
                  <button
                    onClick={() =>
                      inputValue(
                        "Got any creative ideas for a 10 year old's birthday?"
                      )
                    }
                    className="main__examples-btn"
                  >
                    "Got any creative ideas for a 10 year old's birthday?" →
                  </button>
                  <button
                    onClick={() =>
                      inputValue("How do I make an HTTP request in Javascript?")
                    }
                    className="main__examples-btn"
                  >
                    "How do I make an HTTP request in Javascript?" →
                  </button>
                </div>
              </div>
              <div className="main__example">
                <div className="main__example-title-box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    ></path>
                  </svg>
                  <h2>Capabilities</h2>
                </div>
                <div className="main__examples-btn-box">
                  <h3 className="main__examples-btn2">
                    Remembers what user said earlier in the conversation
                  </h3>
                  <h3 className="main__examples-btn2">
                    Allows user to provide follow-up corrections
                  </h3>
                  <h3 className="main__examples-btn2">
                    Trained to decline inappropriate requests
                  </h3>
                </div>
              </div>
              <div className="main__example">
                <div className="main__example-title-box">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <h2>Limitations</h2>
                </div>
                <div className="main__examples-btn-box">
                  <h3 className="main__examples-btn2">
                    May occasionally generate incorrect information
                  </h3>
                  <h3 className="main__examples-btn2">
                    May occasionally produce harmful instructions or biased
                    content
                  </h3>
                  <h3 className="main__examples-btn2">
                    Limited knowledge of world and events after 2021
                  </h3>
                </div>
              </div>
            </div>
          </>
        )}

        <form onSubmit={messageFunc} className="main__prompt">
          {" "}
          <div className="form-box">
            <input
              ref={input}
              required
              type="text"
              className="main__prompt-input"
            />
            <button type="submit" className="main__prompt-btn">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>{" "}
          </div>
          <button
            type="button"
            className={img ? "draw_img2" : "draw_img"}
            onClick={() => setImg(!img)}
          >
            {img ? (
              <p>
                Prompt img about
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pen-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
                </svg>
              </p>
            ) : (
              <p>
                Draw picture{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-image"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                </svg>
              </p>
            )}
          </button>
        </form>
        {img ? (
          <p style={{color:"red",marginTop:"-60px",marginBottom:"10px"}}>Rasm chizishi uchun faqatgina ingliz tilida yozish kerak !!!</p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
