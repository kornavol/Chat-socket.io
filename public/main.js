const socket = io();

const $ = selector => document.querySelector(selector);

const listEnumerable = ['channels', 'users']

const state = {
    list: 0,
    users:[],
    channels:[],
    activeChannel: 'JS',
    activeUser: null,
    usedChannels:{JS:[]}
};

const switchHandler = () => {
    //alert(state.list);
    state.activeUser = null
    switch (state.list) {
        case 0:
            state.list = 1;
            listManager();
            break;
            
        case 1:
            state.list = 0;
            listManager();
                break;
    
        default:
            alert(`There's problem please try again later`)
            break;
    }
}

const listClickHandler = (name) => {
    //alert(name);
    if (state.list == 0 ) {
        const preItem = state.activeChannel;
        state.activeChannel = name;
        $(`#${preItem}`).classList.remove('active');
        $(`#${name}`).classList.add('active');
        if(!state.usedChannels[name]){
            state.usedChannels[name] = [];
        }
        console.log(state.usedChannels);
        $('#chat-box').innerHTML = '';
        state.usedChannels[state.activeChannel].forEach( msg => {
            document.querySelector('#chat-box').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
        });
    } else if(state.list == 1) {
        //TODO: Manage for personal messaging
        state.activeUser = name;
    }
}

const listManager = () => {
    $('#active-list').innerHTML = '';
    const list = state[listEnumerable[state.list]];
    list.forEach(item => {
        $('#active-list').insertAdjacentHTML('beforeend', 
        `<li id = "${item}" onclick = "listClickHandler('${item}')" class = "list-item">
            ${item}
        </li>`);

        if(item == list[list.length-1] && state.list === 0){
            listClickHandler(state.activeChannel);
        }
    });
}

socket.on('chat msg', envelope => {

    //if envelope.channel == onse of the keys of state.usedChannels

    if(envelope.user) {

        document.querySelector('#chat-box').insertAdjacentHTML("beforeend", `<li>${envelope.msg}</li>`);

    } else {

        Object.keys(state.usedChannels).forEach( key => {
            if(envelope.channel == key) {
                state.usedChannels[key].push(envelope.msg);
            }

            console.log(state.usedChannels[key]);
        });

        if (state.activeChannel == envelope.channel) {
            document.querySelector('#chat-box').insertAdjacentHTML("beforeend", `<li>${envelope.msg}</li>`);
        } 
    }
});

socket.on('users', users => {
    state.users = users;
    listManager();
});

socket.on('channels', channels => {
    state.channels = channels;
    listManager();
});

const clickHandler = () => {
    let msg = $('#msg-box');
    socket.emit('chat message', {msg:msg.value, channel:state.activeChannel, user: state.activeUser});
    msg.value = '';
}

socket.emit('token', sessionStorage.getItem('token'));

socket.on('ticket', ticket => {
    document
    .querySelector('#chat-box')
    .insertAdjacentHTML("beforeend", `<li>Welcome on board ${ticket.nickName}</li>`);
    sessionStorage.setItem('token', ticket.token);
});

