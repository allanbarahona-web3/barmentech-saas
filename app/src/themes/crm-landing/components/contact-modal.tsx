import { ContactForm } from '@/src/themes/shared/contact';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
}

export function ContactModal({ isOpen, onClose, language }: ContactModalProps) {
  return (
    <ContactForm
      isOpen={isOpen}
      onClose={onClose}
      language={language}
      apiEndpoint="http://localhost:3000/api/v1/contact"
    />
  );
}
