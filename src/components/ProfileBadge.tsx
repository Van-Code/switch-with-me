import { Badge } from "./ui/badge"
import { CheckCircle2, Shield, Star } from "lucide-react"

interface ProfileBadgeProps {
  emailVerified?: boolean
  phoneVerified?: boolean
  seasonTicketHolderVerified?: boolean
  successfulSwapsCount?: number
}

export function ProfileBadge({
  emailVerified,
  phoneVerified,
  seasonTicketHolderVerified,
  successfulSwapsCount = 0,
}: ProfileBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {emailVerified && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Email Verified
        </Badge>
      )}
      {phoneVerified && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Phone Verified
        </Badge>
      )}
      {seasonTicketHolderVerified && (
        <Badge variant="default" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Season Ticket Holder
        </Badge>
      )}
      {successfulSwapsCount > 0 && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {successfulSwapsCount} Successful Swap{successfulSwapsCount !== 1 ? "s" : ""}
        </Badge>
      )}
    </div>
  )
}