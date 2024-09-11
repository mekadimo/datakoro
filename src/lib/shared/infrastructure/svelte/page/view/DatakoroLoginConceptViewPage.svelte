<script lang="ts">
    import EnvelopeIcon from "phosphor-svelte/lib/Envelope";
    import PasswordIcon from "phosphor-svelte/lib/Password";

    import type { DatakoroLoginConceptView } from "../../../../../view/domain/model/DatakoroLoginConceptView";
    import { AppGlobalState } from "../../model/AppGlobalState";

    export let data: DatakoroLoginConceptView;

    let { i18n } = AppGlobalState.get();
</script>

<section class="hero is-fullheight">
    <div class="hero-body">
        <div class="container">
            <div class="columns is-centered">
                <div class="column is-6-tablet is-5-desktop is-4-widescreen">
                    <form action="" class="box">
                        <div class="content">
                            <h1 class="has-text-centered">
                                {$i18n.t("log_in")}
                            </h1>
                        </div>
                        <div class="field">
                            <label for="" class="label">
                                {$i18n.t("email")}
                            </label>
                            <div class="control has-icons-left">
                                <input class="input" disabled type="email" />
                                <span class="icon is-small is-left">
                                    <EnvelopeIcon
                                        color="#dddedf"
                                        size="1.5em"
                                    />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label for="" class="label">
                                {$i18n.t("password")}
                            </label>
                            <div class="control has-icons-left">
                                <input class="input" disabled type="password" />
                                <span class="icon is-small is-left">
                                    <PasswordIcon
                                        color="#dddedf"
                                        size="1.5em"
                                    />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <button class="button is-link" disabled>
                                {$i18n.t("log_in")}
                            </button>
                        </div>
                        <div class="content">
                            <p class="has-text-danger has-red-text">
                                {$i18n.t("datakoro_01_in_dev")}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    .hero {
        background-color: #ddd;
    }
</style>
