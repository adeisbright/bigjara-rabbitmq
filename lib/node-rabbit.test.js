const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;

const namespace = {
    NodeRabbit: require("./Node-Rabbit"),
};
describe("NodeRabbit", () => {
    describe("messageExchange() ", () => {
        it("Should send a message to the provided exchange", async () => {
            const stub = sinon.stub(namespace, "NodeRabbit").returns(0);
            console.log(new namespace.NodeRabbit());
            const messageExchange = sinon.messageExchange;
            expect(messageExchange()).to.be.true;
        });
    });
});
