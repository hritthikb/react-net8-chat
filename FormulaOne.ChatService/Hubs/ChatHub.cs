using FormulaOne.ChatService.DataService;
using FormulaOne.ChatService.Models;
using Microsoft.AspNetCore.SignalR;

namespace FormulaOne.ChatService.Hubs;

public class ChatHub: Hub{

    private readonly ShareDb _share;
    public ChatHub(ShareDb shared) => _share = shared; 


    //public async Task JoinChat(UserConnection conn){

    //    await Clients.All.SendAsync("ReceiveMessage","admin", $"{conn.UserName}has jonied");
    //}

    public async Task JoinSpecificChatRoom(UserConnection conn){

        //allocate a grp -- assgined it a specific connection
        await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

        _share.connections[Context.ConnectionId]= conn;

        await Clients.Group(conn.ChatRoom).SendAsync("JoinSpecificChatRoom", "admin",$"{conn.UserName}has joined {conn.ChatRoom}");
    }

    public async Task SendMessage(string msg)
    {
        if (_share.connections?.TryGetValue(Context.ConnectionId, out UserConnection conn) == true)
        {
            await Clients.Group(conn.ChatRoom)
                .SendAsync("ReceiveSpecificMessage", conn.UserName, msg);
        }
    }

}