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
        id: 'cert-nvidia',
        filename: 'Nvidia.pdf',
        url: '/certificates/Nvidia.pdf',
        createdAt: 1786487633,
    },
        {
        id: 'cert-Udemy-FastApi',
        filename: 'Udemy-FastApi.pdf',
        url: '/certificates/Udemy-FastApi.pdf',
        createdAt: 1786487793,
    },
]