// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/pc1/js/main.js
// https://github.com/hnasr/javascript_playground/tree/master/webrtc


// class Client {
//     constructor(guid, contract) {
//         this.guid = guid;
//         this.contract = contract;
//     }
//     static connectTo(server) {
//         return false;
//     }
// }

// class Server {
//     constructor(guid, contract, clients) {
//         this.guid = guid;
//         this.contract = contract;
//         clients = clients;
//     }
//     static innitiateServer() {
//         return WebRTC.caller();
//     }
// }

// // // // Fluxo de informação
// // // // 1A - WebRTC.caller() agora sou um servior
// // // // 2A - WebRTC.getOffer() esse é meu 'endereco'
// // // // 3A - enviar a 'offer' ao cliente
// // // // 4B - WebRTC.callee(offer)
// // // // 5B - WebRTC.getAwnser()
// // // // 6B - Envair a 'awnser' ao parceiro servidor
// // // // 7A - WebRTC.awnserClient(awnser)


var WebRTC = WebRTC || {}

WebRTC = (function () {
    var localConnection,
        sendChannel,
        remoteConnection,
        receiveChannel,
        awnser,
        offer,
        __configRemoteChannel = async function () {
            remoteConnection.ondatachannel = e => {
                receiveChannel = e.channel;
                receiveChannel.onmessage = e => console.log("messsage received!!!" + e.data)
                receiveChannel.onopen = e => console.log("open!!!!");
                receiveChannel.onclose = e => console.log("closed!!!!!!");
                remoteConnection.channel = receiveChannel;
            }
        },

        __configSendChannel = function () {
            sendChannel = localConnection.createDataChannel("sendChannel");
            sendChannel.onmessage = e => console.log("messsage received!!!" + e.data)
            sendChannel.onopen = e => console.log("open!!!!");
            sendChannel.onclose = e => console.log("closed!!!!!!");
        },

        _caller = async function () {
            localConnection = new RTCPeerConnection()
            __configSendChannel();

            localConnection.createOffer().then(o => {
                localConnection.setLocalDescription(o)
            }).then(function () {
                localConnection.onicecandidate = e => {
                    offer = JSON.stringify(localConnection.localDescription)
                }
            });

            return offer;

        },

        _callee = async function (offer) {

            remoteConnection = new RTCPeerConnection()

            remoteConnection.onicecandidate = e => {
                console.log(" NEW ice candidnat!! on localconnection reprinting SDP ")
                console.log(JSON.stringify(remoteConnection.localDescription))
            }

            await __configRemoteChannel()

            await remoteConnection.setRemoteDescription(offer).then(a => console.log("done"))

            await remoteConnection.createAnswer()
                .then(a => remoteConnection.setLocalDescription(a))
                .then(a => awnser = JSON.stringify(remoteConnection.localDescription))

        },

        _setOffer = function (offer) {
            this.offer = offer;
        },

        _getOffer = function () {
            return console.log(offer);
        },
        _setAwnser = function (awnser) {
            this.awnser = awnser;
        },

        _getAwnser = function () {
            return console.log(awnser);
        },

        _boo = async function () {
            localConnection = new RTCPeerConnection();
            localConnection.onicecandidate = e => {
                console.log(JSON.stringify(localConnection.localDescription))
            }

            try {
                const offer = await localConnection.createOffer();
                await onCreateOfferSuccess(offer);
            } catch (e) {
                onCreateSessionDescriptionError(e);
            }

        },

        _foo = async function () {

            localConnection = new RTCPeerConnection();
            localConnection.onicecandidate = e => {
                console.log(" NEW ice candidnat!! on localconnection reprinting SDP ")
                console.log(JSON.stringify(localConnection.localDescription))
            }

            const promise = new Promise((resolve, reject) => {
                localConnection.createOffer().then(o => {
                    _setOffer(localConnection.setLocalDescription(o));

                    if (o) {
                        resolve(console.log(offer));
                    } else {
                        reject('reject');
                    }
                })


            })

            promise
                .then((message) => {
                    console.log(message);
                }).catch((message) => {
                    console.log(message);
                });
        },

        _teste = function () {

        },

        _awnserClient = function (awnser) { 
           return localConnection.setRemoteDescription (awnser)
        },

        _sendToServer = function(msg){
            remoteConnection.channel.send(msg)
        },
        
        _sendToClient = function(msg){
            sendChannel.send(msg)
        }

    return {
        caller: _caller,
        setOffer: _setOffer,
        getOffer: _getOffer,
        configRemoteChannel: __configRemoteChannel,
        configSendChannel: __configSendChannel,
        callee: _callee,
        awnserClient: _awnserClient,
        foo: _foo,
        teste: _teste,
        setAwnser: _setAwnser,
        getAwnser: _getAwnser,
        sendToServer:_sendToServer,
        sendToClient: _sendToClient
    }
})();