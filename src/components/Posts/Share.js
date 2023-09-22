import { SimplePool } from "nostr-tools";
import { Fragment, useEffect, useState } from "react";
import { Card } from "./Card";
import { Dialog, Transition } from "@headlessui/react";

export const Share = (props) => {
  const { showShareWindow, onClose } = props;
  console.log("showsharewindow", showShareWindow);
  const [kind0List, setKind0List] = useState([]);
  const [sendTo, setSendTo] = useState([]);

  function addToList() {}

  function removeFromList() {}

  useEffect(() => {
    const storedData = localStorage.getItem("memestr");
    if (!storedData) {
      //alert("Login required to share");
      console.log("Stored dataaaaaa", storedData);
      return;
    }
    (async () => {
      let uesrPublicKey = JSON.parse(storedData).pubKey;
      console.log("Stored dataaaaaa", storedData, uesrPublicKey);
      let relays = [
        "wss://relay.damus.io",
        "wss://relay.primal.net",
        "wss://nos.lol",
        "wss://nostr.bitcoiner.social",
        "wss://nostr.pleb.network",
        "wss://relay.f7z.io",
        "wss://relay.nostr.bg",
        "wss://relay.nostriches.org",
        "wss://relay.snort.social",
      ];
      const relayPool = new SimplePool();
      let contactList = await relayPool.list(relays, [
        {
          kinds: [3],
          authors: [uesrPublicKey],
        },
      ]);
      console.log("constact List", contactList);
      const pubkeys = contactList[0]?.tags?.map((t) => {
        return t[1];
      });
      let kind0s = await relayPool.list(relays, [
        {
          kinds: [0],
          authors: pubkeys,
        },
      ]);
      setKind0List(kind0s);
    })();
  }, []);

  return (
    <>
      <Transition.Root show={showShareWindow} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-10"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="fixed inset-0 w-screen overflow-y-auto">
                  {/* Container to center the panel */}
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900 pb-6"
                            >
                              Share memes with your friends
                            </Dialog.Title>

                            <Dialog.Description>
                              <div>
                                {kind0List.map((kind0) => {
                                  let content = JSON.parse(kind0.content);
                                  return (
                                    <Card
                                      kind0Content={content}
                                      onSelect={addToList}
                                      onDeSelect={removeFromList}
                                    />
                                  );
                                })}
                              </div>
                              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                  type="button"
                                  className="sticky bottom-0"
                                >
                                  Send
                                </button>
                              </div>
                            </Dialog.Description>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* <Modal
        show={showShareWindow}
        onHide={onClose}
        style={{
          minWidth: "50%",
          minHeight: "50%",
          width: "30%",
          zIndex: 3,
          overflowY: "scroll",
        }}
      >
        <Modal.Header closeButton style={{ color: "white" }}>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <div>
          {kind0List.map((kind0) => {
            let content = JSON.parse(kind0.content);
            return (
              <Card
                kind0Content={content}
                onSelect={addToList}
                onDeSelect={removeFromList}
              />
            );
          })}
        </div>
        <Button variant="danger" style={{ position: "fixed", bottom: "10%" }}>
          {" "}
          Send Message
        </Button>
      </Modal> */}
    </>
  );
};
