import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const DEFAULT_MESSAGES = {
    confirmation: {
        password: {
            invalid: "Mot de Passe invalide.",
            short: "le mot de passe doit contenir au moins 8 caractères"
        },
        email: {
            invalid: "Adresse email est invalide.",
            used: "Adresse email est déjà enregistrée.",
        },
        pleaseFill: "Veuillez remplir tous les champs."
    },
    error: {
        default: "Quelque chose s'est mal passé !",
        permission: {
            default: "Interdiction d'accès",
            withLive: "L'offre ne comprend pas l'option de sessions en direct"
        }
    },
    success: {
        default: "Succès !",
        register: "L'inscription a été effectuée avec succès !",
        add: "L'ajout a été effectuée avec succès !",
        image: {
            loading: "L'image est en cours de chargement !",
            upload: "L'image a été importée avec succès !"
        },
        edit: "La modification a été effectuée avec succès !",
        delete: "La suppression a été effectuée avec succès !",
    },
    info: {
        default: "Information !"
    }
}

@Injectable({
    providedIn: 'root'
})
export class ToasterService {

    constructor(private toastr: ToastrService) { }

    error(message = DEFAULT_MESSAGES.error.default, timeOut = 3000) {
        this.toastr.error('', message, { timeOut: timeOut, positionClass: 'toast-bottom-right' });
    }

    success(message = DEFAULT_MESSAGES.success.default, timeOut = 3000) {
        this.toastr.success('', message, { timeOut: timeOut, positionClass: 'toast-bottom-right' });
    }

    info(message = DEFAULT_MESSAGES.info.default, timeOut = 3000) {
        this.toastr.info('', message, { timeOut: timeOut, positionClass: 'toast-bottom-right' });
    }

}
