import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
function App() {
  const [isOn, setIsOn] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [firstTab, setFirstTab] = useState(null);
  const [secondTab, setSecondTab] = useState(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);

  useEffect(() => {
    getTabDataFromStorage("first");
    getTabDataFromStorage("second");
    chrome.storage.local.get(["isExtensionActive"], (data) => {
      setIsOn(data.isExtensionActive);
    });

    const handleStorageChange = (changes) => {
      console.log("storage changed:", changes);
      if (changes.firstTab) setFirstTab(changes.firstTab.newValue);
      if (changes.secondTab) setSecondTab(changes.secondTab.newValue);
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  /**
  * @param {"first" | "second"} whichTab
  */
  const getTabDataFromStorage = (whichTab) => {
    if (whichTab === "first") {
      chrome.storage.local.get(["firstTab"], (data) => {
        setFirstTab(data.firstTab);
      });
    } else {
      chrome.storage.local.get(["secondTab"], (data) => {
        setSecondTab(data.secondTab);
      });
    };
  };

  /**
  * @param {"first" | "second"} whichTab
  */
  const deleteTabDataFromStorage = (whichTab) => {
    if (whichTab === "first") {
      chrome.storage.local.remove("firstTab", () => {
        setFirstTab(null);
      })
    } else {
      chrome.storage.local.remove("secondTab", () => {
        setSecondTab(null);
      })
    };
  }

  /**
  * @param {"first" | "second"} whichTab
  */
  const setTabDataToStorage = (whichTab, data) => {
    if (whichTab === "first") {
      chrome.storage.local.set({ "firstTab": data }, () => {
        setFirstTab(data);
      });
    }
    else {
      chrome.storage.local.set({ "secondTab": data }, () => {
        setSecondTab(data);
      });
    };
  };

  /**
  * @param {"first" | "second"} whichTab
  */
  const deleteOnClick = (whichTab) => {
    if (whichTab === "first") {
      deleteTabDataFromStorage("first");
    }
    else {
      deleteTabDataFromStorage("second");
    }
  };

  /**
  * @param {"first" | "second"} whichTab
  */
  const addButtonClick = async (whichTab) => {
    if (whichTab === "first") {
      setFirstLoading(true);
    }
    else {
      setSecondLoading(true);
    };

    const tab = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]);
      })
    });

    if (whichTab === "first") {
      if (secondTab && secondTab.id === tab.id) {
        alert("Don't select the same tab");
      }
      else {
        setTabDataToStorage("first", tab);
      }

      setFirstLoading(false);
    }
    else {
      if (firstTab && firstTab.id === tab.id) {
        alert("Don't select the same tab");
      }
      else {
        setTabDataToStorage("second", tab);
      }

      setSecondLoading(false);
    };
  };

  return (
    <div className="flex justify-center items-center p-1 bg-gradient-to-r from-cyan-400 to-indigo-700 rounded-lg shadow-[0px_-1px_15px_3px_rgba(0,0,0,0.4)] w-fit">
      <div className="bg-[#061a40] rounded-lg w-fit px-2 py-2">
        {/* Title */}
        <h2
          className="text-center text-gray-200 font-light text-4xl tracking-widest font-[Bitcount]"
        >
          Interchange
        </h2>

        <div className="flex items-center justify-between px-2 mt-2 mb-4 min-w-[440px]">
          {/* Extension status */}
          <motion.span className="text-white/90">
            <AnimatePresence mode="wait">
              <motion.span
                className="text-xl font-[Comic] whitespace-nowrap"
                key={isOn ? "on" : "off"}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  color: isOn ? "#22c55e" : "#ef4444"
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                Extension is {isOn ? "on" : "off"}
              </motion.span>
            </AnimatePresence>
          </motion.span>

          <div
            className="flex text-white  justify-center items-center relative outline outline-[0.5px] outline-white/30 outline-offset-2 rounded-lg"
          >
            {/* Floating bg */}
            <AnimatePresence>
              {hovered !== null && (
                <motion.div
                  layoutId="hoverBg"
                  className="absolute pointer-events-none bg-white/10 rounded-lg h-full w-[48%]"
                  style={{
                    left: hovered === "on" ? "0%" : "52%",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </AnimatePresence>

            <span className="absolute z-0 w-[0.5px] h-full left-1/2 bg-white/30"></span>

            {/* On button */}
            <button
              onMouseEnter={() => setHovered("on")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                chrome.storage.local.set({ "isExtensionActive": true }, () => {
                  setIsOn(true);
                })
              }}
              className="relative shrink-0 z-10 flex items-center gap-1 px-4 py-1  transition rounded-lg cursor-pointer hover:text-green-400 font-[Comic]"
            >
              On
              <svg className="w-4" viewBox="0 0 15 15">
                <path fill="none" stroke="currentColor" d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z" />
              </svg>
            </button>

            {/* Off button */}
            <button
              onMouseEnter={() => setHovered("off")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                chrome.storage.local.set({ "isExtensionActive": false }, () => {
                  setIsOn(false);
                })
              }}
              className="relative z-10 shrink-0 flex items-center gap-1 px-4 py-1 rounded-lg cursor-pointer hover:text-red-400 font-[Comic]"
            >
              Off
              <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path fill="currentColor" d="M32 1.8C15.3 1.8 1.8 15.3 1.8 32S15.3 62.3 32 62.3S62.3 48.7 62.3 32S48.7 1.8 32 1.8m0 56C17.8 57.8 6.3 46.2 6.3 32S17.8 6.3 32 6.3s25.8 11.6 25.8 25.8c0 14.1-11.6 25.7-25.8 25.7" />
                <path fill="currentColor" d="M41.2 22.7c-.9-.9-2.3-.9-3.2 0l-6 6.1l-6.1-6.1c-.9-.9-2.3-.9-3.2 0s-.9 2.3 0 3.2l6.1 6.1l-6.1 6.1c-.9.9-.9 2.3 0 3.2c.4.4 1 .7 1.6.7s1.2-.2 1.6-.7l6.1-6.1l6.1 6.1c.4.4 1 .7 1.6.7s1.2-.2 1.6-.7c.9-.9.9-2.3 0-3.2L35.2 32l6.1-6.1c.8-.9.8-2.3-.1-3.2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col items-center gap-2 mt-2">
          {/* First Tab */}
          <div className="relative w-full h-14 bg-white rounded-md flex items-center">
            <AnimatePresence mode="wait">
              {firstLoading ? (
                // First tab spinner
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : firstTab ? (
                // First tab info
                <motion.div
                  key={firstTab.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center w-full h-full px-2 justify-between"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={firstTab.favIconUrl}
                    className="h-12"
                    alt="FIRST TAB WEBSITE ICON"
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="flex-1 max-w-80 px-3 py-1 rounded-full text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                  >
                    {firstTab.title}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.02 }}
                    className=" h-[90%] duration-300 w-fit cursor-pointer px-2 transition rounded-md hover:bg-black/10"
                    onClick={() => deleteOnClick("first")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[50%] text-black" viewBox="0 0 28 28">
                      <path fill="currentColor" d="M11.5 6h5a2.5 2.5 0 0 0-5 0ZM10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5H10ZM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565l1.207 14.478ZM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75Zm5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0v-8.5Z" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                // First tab add
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="firstTabAdd"
                  className="gap-1 text-lg w-full h-full flex justify-center items-center hover:bg-black/10 transition font-[Comic]"
                  onClick={() => addButtonClick("first")}
                >
                  Add current tab
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 text-black" viewBox="0 0 56 56">
                    <path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Second Tab */}
          <div className="relative w-full h-14 bg-white rounded-md flex items-center">
            <AnimatePresence mode="wait">
              {secondLoading ? (
                // Second tab spinner
                <div className="flex justify-center items-center w-full h-full">
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : secondTab ? (
                // Second tab info
                <motion.div
                  key={secondTab.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center w-full h-full px-2 justify-between"
                >
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    src={secondTab.favIconUrl}
                    className="h-12"
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="flex-1 max-w-80 px-3 py-1 rounded-full text-black text-sm whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                  >
                    {secondTab.title}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.02 }}
                    className=" h-[90%] duration-300 w-fit cursor-pointer px-2 transition rounded-md hover:bg-black/10"
                    onClick={() => deleteOnClick("second")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[50%] text-black" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M3 5.5h18m-4.944 0l-.683-1.408c-.453-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.035 2c-1.066 0-1.599 0-2.04.234a2 2 0 0 0-.278.18c-.395.303-.616.788-1.058 1.757L8.053 5.5m1.447 11v-6m5 6v-6" color="currentColor" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                // Second tab add
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  id="secondTabAdd"
                  className="gap-1 text-lg w-full h-full flex justify-center items-center hover:bg-black/10 transition font-[Comic]" onClick={() => addButtonClick("second")}
                >
                  Add current tab
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 text-black" viewBox="0 0 56 56">
                    <path fill="currentColor" d="M46.867 9.262c-2.39-2.39-5.765-2.766-9.75-2.766H18.836c-3.937 0-7.312.375-9.703 2.766c-2.39 2.39-2.742 5.742-2.742 9.656v18.094c0 4.008.351 7.336 2.742 9.726c2.39 2.39 5.766 2.766 9.773 2.766h18.211c3.985 0 7.36-.375 9.75-2.766c2.391-2.39 2.742-5.718 2.742-9.726V18.988c0-4.008-.351-7.36-2.742-9.726m-1.031 9.07v19.313c0 2.437-.305 4.921-1.71 6.351c-1.43 1.406-3.962 1.734-6.376 1.734h-19.5c-2.414 0-4.945-.328-6.351-1.734c-1.43-1.43-1.735-3.914-1.735-6.352V18.403c0-2.46.305-4.992 1.711-6.398c1.43-1.43 3.984-1.734 6.445-1.734h19.43c2.414 0 4.945.328 6.375 1.734c1.406 1.43 1.711 3.914 1.711 6.328M28 40.504c.938 0 1.688-.727 1.688-1.664v-9.164h9.164c.937 0 1.687-.797 1.687-1.664c0-.914-.75-1.688-1.687-1.688h-9.164v-9.187c0-.938-.75-1.664-1.688-1.664a1.64 1.64 0 0 0-1.664 1.664v9.187h-9.164c-.938 0-1.688.774-1.688 1.688c0 .867.75 1.664 1.688 1.664h9.164v9.164c0 .937.727 1.664 1.664 1.664" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
};


export default App