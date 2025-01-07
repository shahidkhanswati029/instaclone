import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"


const Comment = ({comment}) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
            <AvatarImage src={comment?.author?.profilePicture} className="w-8 h-8 rounded-full"/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm">{comment?.author?.username}<span className="ml-6 font-normal">{comment?.text}</span></h1>
        
      </div>
    </div>
  )
}

export default Comment
