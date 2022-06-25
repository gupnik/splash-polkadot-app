import React, { createContext, ReactChild, useContext, useEffect, useState } from "react";
// import { BackendActor, createActor } from "../lib/actor";
// import { AuthClient } from '@dfinity/auth-client';
// import { canisterId } from "../../../declarations/internet_identity";
import { CanvasKit } from "canvaskit-wasm";
import { loadCanvasKit } from "../lib/utils";
import { useSubstrate } from "../substrate-lib";

export class Shape {
  type: number;
  points: number[];
  color: number[];

  constructor(theType: number, thePoints: number[], theColor: number[] = [0, 0, 0, 255]) {
      this.type = theType;
      this.points = thePoints;
      this.color = theColor;
  }
}

export interface SplashProject {
    id: bigint;
    data: string;
}

export interface SplashContext {
  canvasKit: CanvasKit | null,
  isAuthenticated: boolean,
  // authClient: AuthClient | null,
  // actor: BackendActor | null,
  projects: SplashProject[] | null,
  currentProject: SplashProject | null,
  shapes: Shape[], 
  setShapes: (shapes: Shape[]) => void,
  login: () => void,
  logout: () => Promise<void>,
  create: () => void,
  open: (project: SplashProject) => void,
  close: () => Promise<void>,
}

const splashContext = createContext<SplashContext>({
  canvasKit: null,
  isAuthenticated: false,
  // authClient: null,
  // actor: null,
  projects: null,
  currentProject: null,
  shapes: [],
  setShapes: (shapes: Shape[]) => {},
  login: () => {},
  logout: async () => {},
  create: () => {},
  open: (project) => {},
  close: async () => {},
})

export function SplashContextProvider({ children }: { children: ReactChild }) {
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()

  const [canvasKit, setCanvasKit] = useState<CanvasKit | null>(null);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  // const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  // const [actor, setActor] = useState<BackendActor | null>(null);
  const [projects, setProjects] = useState<SplashProject[] | null>(null);
  const [currentProject, setCurrentProject] = useState<SplashProject | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const setupCanvasKit = async () => {
      const canvasKit = (await loadCanvasKit()) as unknown as CanvasKit;
      console.log(canvasKit);
      setCanvasKit(canvasKit);
    }

    const setupAccount = async () => {
      // Get the list of accounts we possess the private key for
      const keyringOptions = keyring && keyring.getPairs().map(account => ({
        key: account.address,
        value: account.address,
        text: account.meta.name.toUpperCase(),
        icon: 'user',
      }))

      const initialAddress =
      keyringOptions && keyringOptions.length > 0 ? keyringOptions[0].value : ''
      
      if (!currentAccount &&
      initialAddress.length > 0) {
        setCurrentAccount(keyring.getPair(initialAddress))
        setAuthenticated(true)
        setProjects([])
      }
    };

    setupCanvasKit();
    setupAccount();
  }, [keyring]);

  // const onLogin = async () => {
    // const actor = createActor({
    //   agentOptions: {
    //     identity: authClient.getIdentity(),
    //   },
    // });
    // setActor(actor);
    // setAuthenticated(true);

    // await actor.register_device('Splash', 'Key'); //TODO: Fix hard-coded values

    // const projects = await actor.get_projects();
    // setProjects(projects);
    // console.log(projects);
  // }
  
  // const onLogout = async () => {
    // setAuthenticated(false);
    // setActor(createActor());
    // setProjects([]);
  // }

  const login = () => {
    // if (!isAuthenticated) {
    //   authClient.login({
    //     maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
    //     identityProvider: 'https://identity.ic0.app/#authorize',
    //       // process.env.DFX_NETWORK === 'ic'
    //       //   ?
    //       //   : `http://${canisterId}.localhost:8000/#authorize`,
    //     onSuccess: () => { onLogin(authClient) },
    //   })
    // }
  }

  const logout = async () => {
    // if (isAuthenticated) {
    //   await authClient.logout();
    //   onLogout();
    // }
  }

  const create = async () => {
    // await actor.add_project("");
    
    // const projects = await actor.get_projects();
    // setProjects(projects);

    // open(projects[projects.length - 1]);
  }

  const open = (project: SplashProject) => {
    // setShapes(project.data ? JSON.parse(project.data) : []);
    // setCurrentProject(project);
  };

  const close = async () => {
    // currentProject.data = JSON.stringify(shapes);
    // await actor.update_project(currentProject);

    setCurrentProject(null);
  }

  return (
    <splashContext.Provider
        value={{
          canvasKit,
          isAuthenticated,
          // authClient,
          // actor,
          projects,
          currentProject,
          shapes,
          setShapes,
          login,
          logout,
          create,
          open,
          close
        }}>
        {children}
    </splashContext.Provider>
  )
}

export function useSplashContext(): SplashContext {
    return useContext(splashContext)
}