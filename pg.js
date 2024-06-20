import pg from "npm:pg";

async function listenToPgNotify(postgresUrl, eventName) {
  const client = new pg.Client({
    connectionString: postgresUrl,
    ssl: { rejectUnauthorized: false },
  });

  client.connect();

  console.log("\ttime\tevent\tnum");

  client.on("notification", (msg) => {
    if (msg.channel === eventName) {
      const { block_number } = JSON.parse(msg.payload);

      console.log(`\t${new Date().toISOString()}\tNewBlock\t${block_number}`);
    }
  });

  await client.query(`LISTEN "${eventName}"`);

  console.log(`Listening for ${eventName} events...`);
}

listenToPgNotify(Deno.env.get("PG_URL"), "baseSepolia-daimo-new-block");
