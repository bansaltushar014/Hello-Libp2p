import Libp2p from 'libp2p'
import TCP from 'libp2p-tcp'
import defaultsDeep from '@nodeutils/defaults-deep'
import Multiplex from 'libp2p-mplex'
import SECIO from 'libp2p-secio'

const DEFAULT_OPTS = {
    modules: {
        transport: [
            TCP
        ],
        connEncryption: [
          SECIO
        ],
        streamMuxer: [
          Multiplex
        ]
    }
}

class P2PNode extends Libp2p {
    constructor(opts) {
        super(defaultsDeep(opts, DEFAULT_OPTS))
    }
}

export default P2PNode;