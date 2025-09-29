import {test as baseTest} from "@playwright/test";
import {HomePage} from "../src/Page/homePage";
import {DesktopsPage} from "../src/Page/DesktopsPage";

export interface Pages{
    homePage: HomePage;
    desktopsPage: DesktopsPage;
}

export const test = baseTest.extend<Pages>({
    homePage: async ({page}, use): Promise<void> => {
        await use(new HomePage(page))
    },
    desktopsPage: async ({page}, use): Promise<void> => {
        await use(new DesktopsPage(page))
    }
});

