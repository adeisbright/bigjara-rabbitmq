# A Wrapper around amqplib

` npm install node-rabbitmq`

Node RabbitMQ is a helper library that wraps amqplib and provides useful
methods for creating and reading from channels , creating messages
to exchanges and consuming messages from exchanges.

Sending a message to RabbitMQ is as simple as the code below:

```
    const NodeRabbit = require("NodeRabbit")
    const nodeRabbit = new NodeRabbit(process.env.RabbitMQ_Url)
    const {messageExchange , readMessageFromExchange} = nodeRabbit

    const user = {
        name : "Foo Bar" ,
        email : "foo@bar.com" ,
        address : {
            country : "Nigeria" ,
            state : "Lagos"
        } ,
        age : 18 ,
        hobbies : ["Reading" , "Football" , "Dancing" , "Sleeping"] ,
        isNodejsFan : true
    }
    messageExchange(user , "example")
```

The code above will send the user to a direct exchange named "example" using
the default key

## Table of Contents

1. Description
1. Installation
1. Example
1. Testing
1. People
1. Contributions

## Installation

```
   Install from the npm registry
   $ npm i node-rabbitmq

```

## Features

1. Message sending and consumption helpers
1. Enough test coverage
1. Configurable
1. Simple to understand , easy to use

## License

APACHE LICENSE 2.0

## Example and Usage

**\* Getting Started**
When you require node-rabbitmq, you will need to pass your rabbitmq
url and also an optional configuration object.

The optional object comes with the following :

**timeout** duration before the rabbitmq connection closes after creating a channel and sending a message
using that channel
The default value is 100ms

**isDurable** by default this is set to false. It controls the durability of the queue

```
    const NodeRabbit = require("NodeRabbit")
    const nodeRabbit = new NodeRabbit(process.env.RabbitMQ_Url , {timeout : 1000 , isDurable : false})

```

**Sending a message to an Exchange**

To send a message to an exchange, provide the following to the messageExchange method :

message : data that should be sent to the queue

exchange: name of the exchange that the message should be routed to

type : the exchange type which can be any of direct , fanout , header , or topic

key : this binds an exchange to a queue. You should provide this value

```

    const {readMessageFromExchange} = nodeRabbit

    const user = {
        name : "Foo Bar" ,
        email : "foo@bar.com" ,
        address : {
            country : "Nigeria" ,
            state : "Lagos"
        } ,
        age : 18 ,
        hobbies : ["Reading" , "Football" , "Dancing" , "Sleeping"] ,
        isNodejsFan : true
    }
    messageExchange(user , "fanout_exchange" , "fanout" , "user:registration")

```

2. **Reading message from an Exchange**

If you have an exchange that message is published to, you can connect to that exchange to consume
messages.

The readFromExchange requires the following :
**exchange** name of the exchange. This name must match with the name of an exchange that producers
are sending messages to

**type** the exchange type. It must be the same as the type that the producer sends message to

**key** the routing key which must be same as that used by the producer

**cb** a callback to run once the message is successfully read.

Every message is converted to JSON before sending it to an exchange.

So, you should parse a message before using.

See example below:

```

const {readMessageFromExchange} = nodeRabbit

const logMessage = async (message) => {
    const {name , email} = JSON.parse(await message.content.toString())
    console.log(`Hello ${name} , an email was sent to ${email}`)

}

readMessageFromExchange("fanout_exchange" , "fanout" , "user:registration" , logMessage)

```

3. **Publishing a message to a Queue directly**

This is an anti-pattern.

Do not publish message directly to a queue.

Nevertheless, if you are just getting started and you want to quickly test out RabbitMQ ,
you can use the code below to quickly send a message to a queue

Let us use our user and logMessage from the above examples to illustrate how  
to send and consume message from a queue

```
    const {messageQueue} = nodeRabbit
    messageQueue("my_queue" , user)
```

4. **Consuming a message from a Queue**

```
    const {readFromQueue} = nodeRabbit
    readFromQueue("my_queue" , logMessage)
```

## Testing

`npm run test`

## People

[Adeleke Bright](https://github.com/adeisbright)

## Contributing

See [https://github.com/adeisbright/node-rabbitmq/contributing.md]
