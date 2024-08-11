using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using FormulaOne.ChatService.Models;

namespace FormulaOne.ChatService.DataService;

public class ShareDb
{
    private readonly ConcurrentDictionary<string, UserConnection> _connections;
    public ConcurrentDictionary<string, UserConnection> connections;

    public ShareDb()
    {
        _connections = new ConcurrentDictionary<string, UserConnection>();
        connections = _connections;
    }
}
