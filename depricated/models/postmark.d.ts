export {}
declare global {
export interface InboundPostmarkEmail {
    FromName:          string;
    MessageStream:     string;
    From:              string;
    FromFull:          Full;
    To:                string;
    ToFull:            Full[];
    Cc:                string;
    CcFull:            Full[];
    Bcc:               string;
    BccFull:           any[];
    OriginalRecipient: string;
    Subject:           string;
    MessageID:         string;
    ReplyTo:           string;
    MailboxHash:       string;
    Date:              string;
    TextBody:          string;
    HtmlBody:          string;
    StrippedTextReply: string;
    Tag:               string;
    Headers:           Header[];
    Attachments:       Attachment[];
}

export interface Attachment {
    ContentLength: number;
    Name:          string;
    ContentType:   string;
    Content:       string;
    ContentID:     string;
}

export interface Full {
    Email:       string;
    Name:        string;
    MailboxHash: string;
}

export interface Header {
    Name:  string;
    Value: string;
}
}
