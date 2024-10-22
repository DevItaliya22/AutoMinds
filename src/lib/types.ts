export type ConnectionTypes = 'Discord' | 'Notion' | 'Slack' | 'Google' | 'Github';

export type Connection = {
    title: ConnectionTypes
    description: string
    image: string
}