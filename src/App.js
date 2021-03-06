import React, { useState } from "react";
import "./App.css";
import {
  Button,
  Paper,
  Card,
  CardContent,
  TextField,
  Container,
  Typography,
} from "@material-ui/core";
import MyColors from "./colors";
import firebase from "firebase";
import "./firebase";

function App() {
  const dbb = () => firebase.database();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [color, setColor] = useState([]);
  const [thingsToDo, handleThingsTodo] = useState([]);
  const [listStatus, setListStatus] = useState(0);

  const saveItem = () => {
    setColor(MyColors);
    setTodoList((e) => [
      ...e,
      <Container>
        <Card>{subject + ": "} </Card>
        <hr />
        <Card> {description}</Card>
      </Container>,
    ]);
    dbb()
      .ref("/todos/")
      .push("Subject: " + subject + "/ Description: " + description);
  };

  const clearInput = () => {
    setDescription("");
    setSubject("");
  };

  const deletetodoList = () => {
    setTodoList([]);
  };

  const deleteAll = () => {
    if (window.confirm("Delete all?")) {
      dbb().ref("/todos/").set("");
    } else {
      console.log("Database did no change");
    }
  };
  const handleRemoveItem = (id) => {
    const l = [...todoList];
    l.splice(id, 1);
    setTodoList(l);
  };

  const showThingsToDo = () => {
    const data = () => {
      if (listStatus === 0) {
        dbb().ref("/todos/").on("value", handleThingsTodo);
        setListStatus(1);
      } else {
        handleThingsTodo([]);
        setListStatus(0);
      }
      console.log(listStatus);
    };

    const tabla = JSON.stringify(thingsToDo);
    const myTabla = tabla.split(",").map((item, key) => (
      <Container key={key}>
        <Paper key={key} style={{ backgroundColor: "black" }}>
          <Card
            style={{ backgroundColor: color[key] }}
            raised={true}
            width="200px"
            multiple={true}
          >
            {item.slice(24)}
          </Card>
        </Paper>
        <br />
      </Container>
    ));

    return (
      <Container>
        <Button
          size="large"
          variant="outlined"
          color="primary"
          onClick={(e) => {
            data(e);
          }}
        >
          {" "}
          Show / Hide{" "}
        </Button>
        {myTabla}
      </Container>
    );
  };

  return (
    <Container className="container">
      <Typography
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "calc(25px + 2vmin)",
        }}
      >
        My TODO App
      </Typography>
      <Container className="Todo">
        <Card>
          <TextField
            style={{
              padding: "10%",
              backgroundColor: "white",
              minWidth: "500px",
            }}
            placeholder="Subject:"
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
            multiple={true}
          ></TextField>
          <TextField
            placeholder="Description:"
            multiline={true}
            className="input"
            style={{
              alignItems: "initial",
              minHeight: "200px",
              minWidth: "500px",
              backgroundColor: "white",
            }}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></TextField>
        </Card>
        <br />
        <Button
          size="large"
          variant="outlined"
          color="primary"
          onClick={(e) => {
            saveItem(e);
          }}
        >
          {" "}
          Save{" "}
        </Button>

        <Button
          size="large"
          variant="outlined"
          color="secondary"
          onClick={(e) => {
            clearInput(e);
          }}
        >
          {" "}
          Clear{" "}
        </Button>
        <hr />
        <Container>
          {todoList.map((e, k) => (
            <Container key={k}>
              <Paper key={k} style={{ backgroundColor: "black" }}>
                <Card
                  style={{ backgroundColor: color[k] }}
                  raised={true}
                  width="200px"
                >
                  <CardContent
                    style={{
                      textAlign: "left",
                      minHeight: "400px",
                    }}
                  >
                    {" "}
                    {e}{" "}
                  </CardContent>
                </Card>
                <Button
                  onClick={() => handleRemoveItem(k)}
                  variant="outlined"
                  color="secondary"
                >
                  Done
                </Button>
              </Paper>
              <br />
            </Container>
          ))}
        </Container>
        <hr style={{ width: "50%" }} />
        <Button
          size="large"
          variant="outlined"
          color="secondary"
          onClick={(e) => deletetodoList(e)}
        >
          Clear <br></br>
        </Button>
        <br />
      </Container>

      <Container className="Todo">
        <Typography
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "calc(25px + 2vmin)",
          }}
        >
          {" "}
          Things to do:{" "}
        </Typography>
        {showThingsToDo()}
        <Button
          size="large"
          variant="outlined"
          color="secondary"
          onClick={(e) => {
            deleteAll(e);
          }}
        >
          {" "}
          Delete all
        </Button>
      </Container>
      <Typography
        style={{
          color: "white",
          textAlign: "center",
          fontSize: "calc(25px + 2vmin)",
        }}
      >
        programandoconro
      </Typography>
    </Container>
  );
}

export default App;
