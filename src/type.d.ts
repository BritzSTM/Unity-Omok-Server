import { NetConnectOpts } from "net";

type PacketSize = number;
type PacketType = "" | "a";
type PacketData = any;

interface RawPacket
{
    Size: PacketSize;
    Type: PacketType;
    Data: PacketData;
};

interface UserContext
{
    Sock: Socket;
    NickName: string;
}
