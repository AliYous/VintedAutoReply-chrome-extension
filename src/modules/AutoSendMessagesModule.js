/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { Button, Grid, Switch, TextField, Typography } from "@mui/material";

const AutoSendMessagesModule = () => {
  const [messageContent, setMessageContent] = useState("");
  const [deleteEachConvo, setDeleteEachConvo] = useState(true);
  const [sendingMessages, setSendingMessages] = useState(false);

  useEffect(
    () => {
      chrome.storage.local.get(
        ["messageContent", "deleteEachConvo"],
        (items) => {
          setMessageContent(items.messageContent);
          setDeleteEachConvo(items.deleteEachConvo);
        }
      );

      chrome.runtime.onMessage.addListener(function (
        message,
        sender,
        sendResponse
      ) {
        if (message.msg == "autoSendExecutedSuccess") {
          setSendingMessages(false);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClick = () => {
    chrome.storage.local.set({ messageContent: messageContent }, () => {
      setSendingMessages(true);
      chrome.runtime.sendMessage({
        msg: "startAutoSend",
      });
    });
  };

  const handleChange = (event) => {
    setMessageContent(event.target.value);
  };

  const handleDeleteConvCheckboxClick = () => {
    chrome.storage.local.set({ deleteEachConvo: !deleteEachConvo }, () => {
      setDeleteEachConvo(!deleteEachConvo);
    });
  };
  return (
    <>
      <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        alignItems="center"
        className="deleteMessagesToggleRow"
      >
        <Grid item>
          <Typography className="deleteMessagesToggleText">
            Supprimer les conversations après envoi
          </Typography>
        </Grid>
        <Grid item>
          <Switch
            checked={deleteEachConvo}
            onClick={handleDeleteConvCheckboxClick}
          />
        </Grid>
      </Grid>

      <Grid
        container
        item
        xs={12}
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        className="textFieldRow"
      >
        <TextField
          id="outlined-multiline-static"
          placeholder="Contenu du message - exemple: Hey je vois que tu as liké mon article, toujours intéressée ?"
          multiline
          rows={4}
          defaultValue={messageContent}
          value={messageContent}
          onChange={handleChange}
          className="textField"
        />
      </Grid>
      <Grid
        container
        item
        xs={12}
        mt={2}
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        className="buttonRow"
      >
        <Button
          className="startSendButton"
          variant="contained"
          onClick={handleClick}
          disabled={!messageContent && messageContent.length < 10}
        >
          {sendingMessages ? (
            <span className="buttonText">Envoi en cours ...</span>
          ) : (
            <span className="buttonText">Commencer l'envoi</span>
          )}
        </Button>
      </Grid>
    </>
  );
};

export default AutoSendMessagesModule;
