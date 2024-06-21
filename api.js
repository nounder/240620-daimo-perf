import process from "node:process";

const ws = new WebSocket(process.env.DAIMO_API_WS_URL);

const SubMessageId = 10;

const SubAddr = "0xf45e49024CA12c7C19934b8188cc4b2beD794427";

const SubMessage = {
  "id": SubMessageId,
  "method": "subscription",
  "params": {
    "input": {
      "address": SubAddr,
      "sinceBlockNum": 0,
    },
    "path": "onAccountUpdate",
  },
};

ws.onopen = (...args) => {
  console.log("Open");
  ws.send(JSON.stringify(SubMessage));
  console.log(`\ttime\tsinceBlockNum\tlastBlock\tlastFinalizedBlock`);
};

ws.onclose = (...args) => console.log("Closed", args);

ws.onerror = (err) => console.error(err);

ws.onmessage = (e) => {
  const payload = JSON.parse(e.data);

  if (payload.id == SubMessageId && payload.result.type == "data") {
    const { sinceBlockNum, lastBlock, lastFinalizedBlock } =
      payload.result.data;

    console.log(
      `\t${
        new Date().toISOString()
      }\t${sinceBlockNum}\t${lastBlock}\t${lastFinalizedBlock}`,
    );
  }
};
