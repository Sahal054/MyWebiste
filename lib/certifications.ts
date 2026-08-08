export const CERTIFICATIONS_FOLDER_ID = 'certifications'
export const CERTIFICATIONS_FOLDER_NAME = 'Certifications'

export type CertificationRecord = {
    id: string
    filename: string
    url: string
    createdAt: number
}

export const CERTIFICATION_RECORDS: CertificationRecord[] = [
    {
        id: 'cert-react-basics',
        filename: 'react-basics.pdf',
        url: 'https://res.cloudinary.com/dmukukwp6/image/upload/v1/sample.pdf',
        createdAt: 1710000000000,
    },
    {
        id: 'cert-web-performance',
        filename: 'web-performance.pdf',
        url: 'https://res.cloudinary.com/dmukukwp6/image/upload/v1/sample.pdf',
        createdAt: 1710000100000,
    },
]