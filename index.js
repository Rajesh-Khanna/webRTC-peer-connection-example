const HOST = async() => {
    const pc = new RTCPeerConnection();
    pc.onicecandidate = e => console.log(JSON.stringify(pc.localDescription));
    window.dc = pc.createDataChannel('channel');
    window.dc.onmessage = e => console.log(e.data);
    window.dc.onopen = e => console.log('channel open');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    document.querySelector('#ask').style.visibility = "visible";

    document.querySelector('#ask').addEventListener('click', async() => {
        var answer = prompt("Past answer here: ", "");
        if (answer == null || answer == "") {
            console.log('null');
        } else {
            pc.setRemoteDescription(JSON.parse(answer));
            console.log(answer)
        }
    })
}

const GUEST = async() => {
    const pc = new RTCPeerConnection();
    pc.onicecandidate = e => console.log(JSON.stringify(pc.localDescription));

    pc.ondatachannel = e => {
        window.dc = e.channel;
        window.dc.onmessage = e => console.log(e.data);
        window.dc.onopen = e => console.log('channel open');
    }

    document.querySelector('#ask').style.visibility = "visible";
    document.querySelector('#ask').addEventListener('click', async() => {
        var offer = prompt("Please enter your name:", "Harry Potter");
        if (offer == null || offer == "") {
            console.log('null');
        } else {
            await pc.setRemoteDescription(JSON.parse(offer));
            const answer = await pc.createAnswer()
            pc.setLocalDescription(answer);
            console.log(answer)
        }
    });
}