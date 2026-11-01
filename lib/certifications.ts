export const CERTIFICATIONS_FOLDER_ID = 'certifications'
export const CERTIFICATIONS_FOLDER_NAME = 'Certifications'

export type CertificationRecord = {
    id: string
    filename: string
    url: string
    createdAt: number
}

export function isPdfDocument(filename: string, content?: string) {
    return [filename, content].some(value => value
        ? value.toLowerCase().split(/[?#]/, 1)[0].endsWith('.pdf')
        : false)
}

export const CERTIFICATION_RECORDS: CertificationRecord[] = [
    {
        id: 'AWS-Certified-Developer-Associate',
        filename: 'AWSCertifiedDeveloperAssociatecertificate.pdf',
        url: '/certificates/AWSCertifiedDeveloperAssociatecertificate.pdf',
        createdAt: 1793544421,
    },
    {
        id: 'Claude-Certified-Developer-Foundations',
        filename: 'ClaudeCertifiedDeveloperFoundations.pdf',
        url: '/certificates/ClaudeCertifiedDeveloperFoundations.pdf',
        createdAt: 1793544409,
    },
    {
        id: 'cert-react-foundations',
        filename: 'react-foundations.pdf',
        url: '/certificates/react-foundations.pdf',
        createdAt: 1710000000000,
    },
    {
        id: 'cert-meta-backend',
        filename: 'Meta-Backend.pdf',
        url: '/certificates/Meta-Backend.pdf',
        createdAt: 1710000100000,
    },

    {
        id: 'cert-Microsoft',
        filename: 'Microsoft-c.pdf',
        url: '/certificates/Microsoft-c.pdf',
        createdAt: 1786487609,
    },
    {
        id: 'SAP-Certified-Integration-Developer',
        filename: 'SAPCertifiedIntegrationDeveloper.pdf',
        url: '/certificates/SAPCertifiedIntegrationDeveloper.pdf',
        createdAt: 1793544250,
    },
]