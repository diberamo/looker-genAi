import { Box, Heading, Space, SpaceVertical, Span } from "@looker/components";
import React, { Component, useRef } from "react";
import { ConfigReader } from "../services/ConfigReader";
import { Logger } from "../utils/Logger"

export class ExploreGenAIComponent extends Component {
    // private refInput: React.RefObject<ExploreGenAIComponent>;s

    // ref = React.createRef();

    
    // constructor(props: any) {
    //     // super(props);
    //     // debugger;
    //     // this.refInput = React.createRef(); //create ref
    //     Logger.debug("Criou elemento Component Explore GenAI Component");
    // }
    constructor(props:any)
    {
        super(props);
        Logger.debug("Criou elemento Component Explore GenAI Component");
    }
    shouldComponentUpdate(nextProps:any) {
        // Rendering the component only if 
        // passed props value is changed
        return false;
    }

    
    componentDidMount() {
        Logger.debug("Component did mount");
    }

    render() {
        //to associate the ref with our component
        Logger.debug("Rendering");
        return (
            <Box>
                <Space around>
                </Space>
                <SpaceVertical>
                    <Space around>
                        <Heading fontWeight="semiBold"> Looker AI Demo: go/lookerai-llm-demo - Design: go/lookerai-llm</Heading>
                    </Space>
                    <Space around>
                        <Span> v:{ConfigReader.CURRENT_VERSION} - updated:{ConfigReader.LAST_UPDATED}</Span>
                    </Space>
                </SpaceVertical>        
            </Box>    
        );
    }
}