export {}
declare global {
export interface BlandCallRecord {
    c_id:            string;
    created_at:      string;
    call_length:     string;
    to:              string;
    from:            string;
    inbound:         string;
    max_duration:    string;
    variables:       string;
    start_time:      string;
    completed:       string;
    queue_status:    string;
    error_message:   string;
    answered_by:     string;
    batch_id:        string;
    started_at:      Date;
    record:          string;
    recording_url:   string;
    summary:         string;
    local_dialing:   string;
    price:           string;
    call_ended_by:   string;
    analysis:        string;
    analysis_schema: string;
    campaign_id:     string;
    transferred_to:  string;
    pathway_tags:    string;
    pathway_tags_1:  string;
    transcripts:     string;
}
}
