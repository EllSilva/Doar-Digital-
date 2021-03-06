import App from '../library/superApp.js'
import cache from '../library/cache.js'
const Super = new App
export default {
    template: "#c-header",

    data: function() {
        return {
            Super,
            cache,
            status: true,
            total: 0,
            id: 0,
            show: false,
            user: {
                credencial: null,
            },
            corruente_institution: {
                nome_fantasia: null
            },
            instituicoes: [],
            institution_name: "Todos",
            resumo: [],
            status_pop: false,
            search: "",
        }
    },
    methods: {
        toggle() {
            this.status = !this.status
            this.$eventHub.$emit('toggle-menu', this.status)
        },
        async updade_pop() {
            this.instituicoes = await this.Super.search_institution(this.search)
            let list_term = this.instituicoes.map(post => {
                post.terms = `@ ${post.dominio} - ${post.subdominio}`
                return post
            })
            let searching = list_term.filter(post => post.terms.indexOf(this.search) > 0)
            this.resumo = searching.splice(0, 3)
            if (this.search.length == 0) {
                this.resumo = Array.from(this.instituicoes).splice(0, 3)
            }
        },
        toggle_pop() {
            this.status_pop = !this.status_pop
        },
        change_domain(id) {
            localStorage.setItem('institution', id)
            location.reload()
        }
    },
    emits: ['toggle-menu'],
    async mounted() {
        this.user = await this.Super.get_admin(this.cache.user_logged_id)
        this.corruente_institution = await this.Super.get_institution(this.cache.institution)

        let todas_intituicoes = { data: [] }

        let instituicoes = []
        let minhas_instituicoes = {}
        if (this.user.credencial != 1) {
            instituicoes = await this.Super.list_institution_by_adm(this.cache.email)
            minhas_instituicoes = instituicoes[0]
            todas_intituicoes.data = instituicoes
        }

        if (this.user.credencial == 1) {
            todas_intituicoes = await this.Super.all_institution()
        }

        this.id = this.cache.institution
        this.instituicoes = todas_intituicoes.data
        this.total = todas_intituicoes.total
        this.show = todas_intituicoes.data.length > 1
        this.resumo = Array.from(this.instituicoes).splice(0, 3)
        if (this.user.credencial != 1) {
            this.resumo = Array.from(this.instituicoes)
        }
        this.institution_name = minhas_instituicoes.nome_fantasia
    }
}