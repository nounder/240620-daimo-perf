#!/usr/bin/env deno run --unsafely-ignore-certificate-errors -A

/**
 * Connects to Ehtereum RPC  node and listen for new blocks
 */
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";

const WS_URL = Deno.env.get("WS_URL");

const provider = new ethers.providers.WebSocketProvider(WS_URL);

console.log("\ttime\tevent\tnumber\tsrc");

provider.on("block", (blockNumber) => {
  console.log(
    `\t${new Date().toISOString()}\tNewBlock\t${blockNumber}\t${WS_URL}`,
  );
});

provider.on("error", (error) => {
  console.error("Subscription error:", error);

  Deno.exit(1);
});
