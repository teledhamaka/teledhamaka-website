import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from 'react-share';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  size?: number;
  round?: boolean;
}

export default function ShareButtons({
  url,
  title,
  description = '',
  tags = [],
  size = 32,
  round = true,
}: ShareButtonsProps) {
  const fullUrl = `https://yourdomain.com${url}`;
  const hashtags = tags.map(tag => tag.replace(/\s+/g, ''));
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  return (
    <div className="share-buttons my-6">
      <h3 className="text-lg font-medium mb-3">Share this post:</h3>
      <div className="flex flex-wrap items-center gap-3">
        <FacebookShareButton
          url={fullUrl}
          title={title}  // Use title instead of quote
          hashtag={hashtags.length > 0 ? `#${hashtags[0]}` : undefined}
        >
          <FacebookIcon size={size} round={round} />
        </FacebookShareButton>

        <TwitterShareButton
          url={fullUrl}
          title={title}
          hashtags={hashtags}
        >
          <TwitterIcon size={size} round={round} />
        </TwitterShareButton>

        <LinkedinShareButton
          url={fullUrl}
          title={title}
          summary={description}
          source="BSNL Broadband Blog"
        >
          <LinkedinIcon size={size} round={round} />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={fullUrl}
          title={title}
        >
          <WhatsappIcon size={size} round={round} />
        </WhatsappShareButton>

        <TelegramShareButton
          url={fullUrl}
          title={title}
        >
          <TelegramIcon size={size} round={round} />
        </TelegramShareButton>

        <EmailShareButton
          url={fullUrl}
          subject={title}
          body={`Check out this BSNL broadband plan: ${title}\n\n`}
        >
          <EmailIcon size={size} round={round} />
        </EmailShareButton>

        <button
          onClick={handleCopyLink}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Copy link"
        >
          <FaCopy className="text-gray-700" size={size - 8} />
        </button>
      </div>
    </div>
  );
}