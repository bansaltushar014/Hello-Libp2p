'use strict'
/* eslint-disable no-console */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import PeerId from 'peer-id'
import PeerInfo from 'peer-info'
import Node from './libp2p_bundle.js'
import pull from 'pull-stream'
import Pushable from 'pull-pushable'
const p = Pushable()
import chalk from 'chalk'
import emoji from 'node-emoji'


PeerId.createFromJSON(require('./ids/moonId'), (err, peerId) => {
    if (err) {
        throw err
    }
    const peerInfo = new PeerInfo(peerId)
    peerInfo.multiaddrs.add('/ip4/127.0.0.1/tcp/10333')
    const nodeListener = new Node({ peerInfo })

    nodeListener.start((err) => {
        if (err) {
            throw err
        }

        nodeListener.on('peer:connect', (peerInfo) => {
            console.log(emoji.get('moon'),
                chalk.blue(' Moon found Earth '),
                emoji.get('large_blue_circle'),
                chalk.blue(` on: ${peerInfo.id.toB58String()}`));
            console.log('\n' + emoji.get('moon'),
                chalk.green(' Moon waiting for message from Earth ')
                + emoji.get('large_blue_circle'))
        })

        nodeListener.handle('/chat/1.0.0', (protocol, conn) => {
            pull(
                p,
                conn
            )

            pull(
                conn,
                pull.map((data) => {
                    return data.toString('utf8').replace('\n', '')
                }),
                pull.drain(console.log)
            )

            process.stdin.setEncoding('utf8')
            process.openStdin().on('data', (chunk) => {
                var data = `${chalk.blue("Message received from Moon: ")}\n\n`
                    + chunk.toString() + `\n${emoji.get('incoming_envelope')}
                ${chalk.blue("  Send message from Earth:")}`

                p.push(data)
            })
        })

        console.log(emoji.get('moon'), chalk.blue(' Moon ready '),
            emoji.get('headphones'), chalk.blue(' Listening on: '));

        peerInfo.multiaddrs.forEach((ma) => {
            console.log(ma.toString() + '/p2p/' + peerId.toB58String())
        })

        console.log('\n' + emoji.get('moon'), chalk.blue(' Moon trying to connect with Earth '),
            emoji.get('large_blue_circle'));
    })
})