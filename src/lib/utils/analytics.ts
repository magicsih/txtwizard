export function trackToolsUsageEvent(toolName: string, eventName: string, params: Record<string, any>) {
    if (window.gtag) {
        window.gtag('event', 'tools_usage', {
            tool_name: toolName,
            event_name: eventName,
            ...params,
        });
    }
}