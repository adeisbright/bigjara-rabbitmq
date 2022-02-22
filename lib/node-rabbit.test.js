const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const NodeRabbit = require("./Node-Rabbit");
const amqplib = require("amqplib");

describe("NodeRabbit", () => {
    let nodeRabbit;
    afterEach(() => {
        sinon.restore();
    });
    before(() => {
        nodeRabbit = new NodeRabbit("amqp://localhost:9200", {
            timeout: 500,
            isDurable: false,
        });
    });

    describe("messageExchange()", async function () {
        it("It should send a message to the exchange", async function () {
            const messageExchangeStub = sinon.stub(
                nodeRabbit,
                "messageExchange"
            );

            let message = "Hello, World";
            let type = "fanout";
            let key = "message:greeting";

            function createChannel() {
                return {
                    assertExchange: () => true,
                    publish: () => true,
                };
            }
            sinon.stub(amqplib, "connect").returns(createChannel);

            expect(await messageExchangeStub(message, type, key)).to.be.eq(
                true
            );
        });
    });
});
