import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import { IMessages } from '../Interface'
import { Tooltip, Avatar } from "@chakra-ui/react"


type Props = {
    messages: IMessages[]
}

const ScrollableChat = ({ messages }: Props) => {

    const { user }: any = ChatState()

    return (
        <div >

            {messages && messages.map((m, i) => (
                <div style={{ display: 'flex' }} key={m._id} >
                    {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                <Avatar
                                    mt="7px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#F1FDD8" : "#FFFFFF"
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i) ? 6 : 14,
                            borderRadius: "7px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}
                    >{m.content}

                    </span>

                </div>
            ))}
        </div>
    )
}

export default ScrollableChat