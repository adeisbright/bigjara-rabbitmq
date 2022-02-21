const sinon = require("sinon");
const chai = require("chai");
const NodeRabbit = require("./Node-Rabbit");
const expect = chai.expect;

describe("NodeRabbit", () => {
    describe("messageExchange() ", () => {
        it("Should send a message to the provided exchange", async () => {
            // Stub the constructor
            const nodeRabbit = new NodeRabbit("url");
            const stub = sinon.stub(nodeRabbit, "messageExchange");
            //Stub the messageExcange method
        });
    });
});
