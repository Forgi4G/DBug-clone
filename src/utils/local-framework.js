class LocalFramework {
    constructor(options = {}) {
        this.options = options;
    }

    /** Send a message and completely ignores all errors to avoid API errors
     *
     * @param input
     */
    sendMSG(input) {
        if (this.options.listener) {
            let listener = this.options.listener;
            listener.channel.send(input).catch(err => { return err; });
        } else if (!this.options.listener) {
            throw new Error("Missing an event listener");
        } else if (!input) {
            throw new Error("Missing input");
        }
    }

    /** Sends a temporary message and ignores all errors
     *
     * @param input - Your content
     * @param ms - milliseconds
     */
    sendTempMSG(input, ms) {
        // Defaulting the timeout
        if (!ms) { ms = 3000; }
        if (this.options.listener) {
            (this.options.listener).channel.send(input).catch(err => { return err; })
                .then(m => { if (m) m.delete({ timeout: ms })
                    .catch(err => { return err; })})
        } else if (!this.options.listener) {
            throw new Error("Missing an event listener");
        } else if (!input) {
            throw new Error("Missing input");
        }
    }

    /** Deletes a message and can delete on a timer
     *
     * @param message - required parameter in order to function
     * @param ms - optional timeout
     */
    deleteMSG(message, ms) {
        if (!message) throw new Error("Missing a message to delete");
        if (!ms) message.delete();
        if (ms) {
            message.delete({ timeout: ms }).catch(err => { return err; })
        }
    }

    /** Sends a ping to the author and avoids all errors
     *
     * @param input
     */
    sendReply(input) {
        if (this.options.listener) {
            let listener = this.options.listener;
            listener.reply(input).catch(err => { return err; });
        } else if (!this.options.listener) {
            throw new Error("Missing an event listener");
        } else if (!input) {
            throw new Error("Missing input");
        }
    }

    /** Sends a temporary reply, default time is 3 seconds
     *
     * @param input - Required input
     * @param ms - Optional time in milliseconds
     */
    sendTempReply(input, ms) {
        // Defaulting the timeout
        if (!ms) { ms = 3000; }
        if (this.options.listener) {
            (this.options.listener).reply(input).catch(err => { return err; })
                .then(m => { if (m) m.delete({ timeout: ms })
                    .catch(err => { return err; })})
        } else if (!this.options.listener) {
            throw new Error("Missing an event listener");
        } else if (!input) {
            throw new Error("Missing input");
        }
    }
}

module.exports = LocalFramework;

/*
How to use:

1.) Require the class in a file
2.) Initialize the listener object (usually known as message) in the async method as { listener: <message> } in the constructor
3.) Call it
4.) See example below if you need a reference

Example:
run: async (client, message, args) => {
    const LocalFramework = require("../../utils/local-framework");
    // Uses the message (2nd parameter) as the listener.
    const localFramework = new LocalFramework({ listener: message });

    // Send a message with the framework
    localFramework.sendMSG("Greetings."); // Sends the message to the channel the message is in which is sent as "Greetings."
}

 */